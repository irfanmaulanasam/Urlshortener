var jwt = require('express-jwt');
const config = require('config')
const secret = config.get('secret')

function getTokenFromHeader(req){
 if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
   return req.headers.authorization.split(' ')[1];
 }
  return null;
}

var auth = {
 required: jwt({
   secret: secret,
   algorithms: ['sha1', 'RS256', 'HS256'],
   userProperty: 'payload',
   getToken: getTokenFromHeader
 }),
 optional: jwt({
   secret: secret,
   algorithms: ['sha1', 'RS256', 'HS256'],
   userProperty: 'payload',
   credentialsRequired: false,
   getToken: getTokenFromHeader
 })
};

module.exports = auth