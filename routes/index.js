var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'EasyCooking' });
});

router.get('/login', (req, res) => {
  res.render('login')
})

//trying to get the results from the API
// let data = {
//   layout: false
// }
// res.render('teams', data);

router.get('/api-results', (req, res) => {

  res.render('apiResults')
})

module.exports = router;
