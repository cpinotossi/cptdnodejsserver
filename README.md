# Nodejs
Simple HTTP Server which does support following features.

- TLS
- mTLS
- Response all HTTP Request header
- create CPU load via query parameter f
 - f=42 is a good fit in most cases.

Install and run.

~~~ bash
npm install
npm run start
curl -v http://localhost:8080
curl -v -k https://localhost:4040
~~~


TODO
- Create an valid certificate via let´s encrypte

## Test client certificate locally 

~~~ bash
curl -v -k --tlsv1.2 --cert openssl/alice.crt --key openssl/alice.key https://127.0.0.1:4040/
echo quit | openssl s_client -showcerts -connect 127.0.0.1:4040 # get more details about the cert.
openssl s_client -tls1_2 -connect 10.217.0.202:2003 -showcerts # show certificate
~~~

# Misc

## Git tricks

~~~ bash
prefix=cptdnodejsserver
git config --global init.defaultBranch main
git init
gh repo create $prefix --public
git remote add origin https://github.com/cpinotossi/${prefix}.git
git add *
git commit -m"add logging framework pino"
git push origin main
~~~