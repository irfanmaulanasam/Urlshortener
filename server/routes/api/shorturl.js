const express = require("express");
const {required} = require('../../middleware/auth');
const {readUrl, createUrl} = require('../../controller/shortUrlController')
var shortUrlRoutes = express.Router();

shortUrlRoutes.get('/:shortUrl', readUrl)
shortUrlRoutes.post("/", required, createUrl);
  
module.exports = shortUrlRoutes;