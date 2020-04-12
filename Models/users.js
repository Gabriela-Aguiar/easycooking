var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Schema = mongoose.Schema


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
