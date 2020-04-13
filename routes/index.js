var express = require('express');
var router = express.Router();
const token = process.env['API_TOKEN']
const apiUrl = `https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=${token}`

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'EasyCooking' });
});

router.get('/login', (req, res) => {
  res.render('login')
})

//trying to get the results from the API
router.get('/api-results', (req, res) => {
  res.render('apiResults')
})

module.exports = router;
