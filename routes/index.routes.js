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

// router.get('/hack', (req, res) => {
//   res.render('allrecipes')
// })

router.post('/hack', ( req,res ) => {
  const {
    ingredients
  } = req.body
  console.log(ingredients);
  res.send('qualquer coisa')
  axios.get(`https://api.spoonacular.com/recipes/search?query=${ingredients}&number=100&apiKey=c56a2c3dc10f4cd48c4c94ddb1d371c0`)
  .then( resp => {
      resp.data.results.forEach( recipe => {
          const { title,readyInMinutes,image,id } = recipe
          Recipe.create( { title, readyInMinutes, image, id } )
          console.log('receita criada com sucesso');
      })
      res.render('hack')
  })
  .catch( err => console.log(err))
})

//trying to get the results from the API
router.get( '/api-results', ( req, res ) => {
  res.render( 'apiResults' )
} )
module.exports = router;