#!/usr/bin/env nodejs

const url = require('url');
require('dotenv').config();
const logger = require('./logger');

const port = process.env.PORT || 8080;
// const portSSL = process.env.PORT || process.env.PORTSSL;
const color = process.env.SCOLOR || "red";
// const iipSSL = (process.env.INTERFACEIPSSL)?process.env.INTERFACEIPSSL:'0.0.0.0';
const iip = process.env.INTERFACEIP || '0.0.0.0';

// Object which will be printed on server response
let details = {
    ladd: '',
    lport: '',
    radd: '',
    rport: '',
    mtls: ''
};

if(process.env.SSL === "true"){
    createServerSSL();
}else{
    createServer();
}

//Create server
function createServerSSL() {
    const https = require('https');
    const fs = require('fs');
    // Option of the SSL server
    const optionsSSL = {
        key: fs.readFileSync('./openssl/srv.key'),
        cert: fs.readFileSync('./openssl/srv.crt'),
        requestCert: true,
        rejectUnauthorized: false, // so we can do own error handling
        ca: [
            fs.readFileSync('./openssl/ca.crt')
        ]
    };

    var server = https.createServer(optionsSSL);
    server.on('request', (req, res) => {
        //Create some cpu load
        let f = (url.parse(req.url, true).query.f) ? parseInt(url.parse(req.url, true).query.f) : 0;
        details.ladd = req.socket.localAddress;
        details.lport = req.socket.localPort;
        details.radd = req.socket.remoteAddress;
        details.rport = req.socket.remotePort;
        details.mtls = req.socket.authorized;
        console.log(JSON.stringify(details, null, '\t'))
        logger.info(details);
        res.write(`<body bgcolor="${color}">\n`);
        res.write(`<div>in:${f},out:${fibo(f)}</div>\n<pre>`);
        res.write(`${JSON.stringify(req.headers, null, '\t')}\n`);
        res.write(`${JSON.stringify(details, null, '\t')}\n`);
        //Verify if user did send client certificate.
        if (req.socket.authorized) {
            res.write(`client-cert:${req.socket.getPeerCertificate().subject.CN}\n`);
        }
        res.write(`<pre></body>\n`);
        res.end();
    });
    server.listen(port, iip, () => {
        logger.info(`ServerSSL waiting on ${server.address().address}:${port} for you`);
    })
}

function createServer() {
    const http = require('http');
    // Create http server
    var server = http.createServer();
    server.on('request', (req, res) => {
        //Create some cpu load
        let f = (url.parse(req.url, true).query.f) ? parseInt(url.parse(req.url, true).query.f) : 0;
        details.ladd = req.socket.localAddress;
        details.lport = req.socket.localPort;
        details.radd = req.socket.remoteAddress;
        details.rport = req.socket.remotePort;
        logger.info(details);
        console.log(JSON.stringify(details, null, '\t'))
        res.write(`<body bgcolor="${color}">\n`);
        res.write(`<div>in:${f},out:${fibo(f)}</div>\n<pre>`);
        res.write(`${JSON.stringify(req.headers, null, '\t')}\n`);
        res.write(`${JSON.stringify(details, null, '\t')}\n`);
        res.write(`<pre></body>\n`);
        res.end();
    });

    server.listen(port, iip, () => {
        logger.info(`ServerHTTP waiting on ${server.address().address}:${port} for you`);
    })
}


function fibo(num) {
    if (num <= 1) {
        return num;
    } else {
        return fibo(num - 1) + fibo(num - 2);
    }
}
