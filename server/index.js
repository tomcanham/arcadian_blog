// const proxy = require('express-http-proxy');
// const app = require('express')();
// const cors = require('cors')

// app.use('/', proxy('localhost.com:3000'));

const request = require('request');
const base64url = require('base64url');
const nJwt = require('njwt');
const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const token = 'eyJraWQiOiJveWxJQWdVOHJ5WGFtRHl4RXVWSlRNTlN1RURDX0xaQzlaTG95aWJZcnowIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHVpa3E0a29qc1MzNmdzSzBoNyIsIm5hbWUiOiJUYWxib3QgQ2FuaGFtIiwiZW1haWwiOiJhbHBoYXNpbWlhbkBnbWFpbC5jb20iLCJ2ZXIiOjEsImlzcyI6Imh0dHBzOi8vZGV2LTgxMTc0NC5va3RhcHJldmlldy5jb20vb2F1dGgyL2F1c2lvamJ3c3RNYkViMzIxMGg3IiwiYXVkIjoiMG9haWtmbjRoYjlZNkFVOEgwaDciLCJpYXQiOjE1NDYyNDYxMjMsImV4cCI6MTU0NjI0OTcyMywianRpIjoiSUQualZzRnFJdmp2VEFad19mXzRRWVRBQlNHd0hqM2lMQmpyZzhwQ05NRVJrSSIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvaWtxNGtqZXJYdW5MdFAwaDciLCJub25jZSI6IlBLajhIbElPeU1KZUNQR3pGWURPNE5BNUo1elZRRU1ybmNlMUtyc3BDVmV6RXppaHQzRkIzQTVSMzhib1paS2YiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbHBoYXNpbWlhbkBnbWFpbC5jb20iLCJhdXRoX3RpbWUiOjE1NDYyNDYxMjMsImF0X2hhc2giOiJGYnkxOUJ6dnA5Qi15bU43MndqVmx3In0.unySivzPdSNRcHcZVmJh_RArMNLcBvX-A4Q-qWqcahcuiZ8Bd82M86p5V2k4rSvsBNttcCw1U6-h4qFAszgP_le3QZaoZb7tTXxgRFb8yNlfarAzir73-XLo4ImsW6L8tsCkOM81ob8DjaUjTTlq6blWbGknhT6G5djdzo2txxBswheJYsQTWaHH5T6DRQccslPHnpoP-01O-AEA7jtLRP4OLqrndmIHK28DrbrZ7eOFNriajeQf4wcyBYgaJs2RQHGpHJrGLfnr4AJZemsr_yxawl5j0Q2rxL33kpCW9sMkxxJEjiG02B24QanZ7BVwyPSE_YADgr2Hszcfa9re3Q';

const nonce = 'PKj8HlIOyMJeCPGzFYDO4NA5J5zVQEMrnce1KrspCVezEziht3FB3A5R38boZZKf';
console.log('NONCE:', nonce);

const parts = token.split('.');
const headerRaw = base64url.decode(parts[0]);
const claimsRaw = base64url.decode(parts[1]);
const header = JSON.parse(base64url.decode(parts[0]));
const claims = JSON.parse(base64url.decode(parts[1]));
const signature = base64url.decode(parts[2]);
const kid = header.kid
const alg = header.alg

console.log("HEADER:", header);
console.log("CLAIMS:", claims);

request('https://dev-811744.oktapreview.com/oauth2/ausiojbwstMbEb3210h7/v1/keys', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    const json = JSON.parse(body);
    const key = json.keys.find(candidate => candidate.kid === kid)
    if (key) {
        console.log("FOUND KEY:", key);

        const n = Buffer.from(base64url.decode(key.n));
        const e = Buffer.from(base64url.decode(key.e));

        const pubKey = new NodeRSA();
        pubKey.importKey({ n, e }, 'components-public');
        const cert = pubKey.exportKey('pkcs8-public-pem');
        console.log('CERT:', cert);

        const joined = parts[0] + '.' + parts[1] + '.' + parts[2];
        const unencrypted = Buffer.from(joined);
        // const verifier = nJwt.createVerifier().withKeyResolver((kid, cb) => cb(null, key));
        // const encrypted = pubKey.encrypt(unencrypted);
        jwt.verify(token, cert, { algorithms: ['RS256'] }, function(err, decoded) {
            console.log('ERR:', err);
            console.log(decoded);
          });        // const encoded = base64url.encode(encrypted);
        // console.log('SIGNATURE:', encoded);
    }
});