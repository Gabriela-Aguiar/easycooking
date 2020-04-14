var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=${token}`
const User = require( '../Models/users' )

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', );
} );

router.get('/allrecipes', (req, res) => {
  res.render('allrecipes')
})

//trying to get the results from the API
router.get( '/api-results', ( req, res ) => {
  res.render( 'apiResults' )
} )
module.exports = router;