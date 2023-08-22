
## Certificate Request

I am assuming the website is not accessible from the Internet, but it will still need certificate from a global certificate authority

```
openssl req -new -newkey rsa:2048 -nodes -out FQDN.csr -keyout FQDN.key -subj "/C=Country/ST=State/L=Texarkana/O=Organization/OU=Organizational Unit/CN=FQDN"
```
##

Use csr to get a valid certificate from a certificate authority. Also, obtain the certificate authority intermediate certificate. Save as FQDN.crt and INT.crt


## Combine certs for HAProxy

cert+privkey+intermediate

```
cat FQDN.crt > hostname.pem
cat FQDN.key >> hostname.pem
cat INT.crt >> hostname.pem
```



