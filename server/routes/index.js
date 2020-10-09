const express = require("express");
const routes = express.Router()

routes.use('/',require('./api/user'))
routes.use('/', require('./api/shorturl'))
  
module.exports = routes