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

# Misc

## Git tricks

~~~ bash
prefix=cptdnodejsserver
gh repo create $prefix --public