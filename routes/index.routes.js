var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`
const apiUrlFinal = `&number=100&apiKey=${token}`

const User = require( '../Models/users' )
const axios = require( 'axios' );
const Recipe = require( '../Models/recipeSchema' )

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', );
} );

router.get( '/allrecipes', ( req, res ) => {
  res.render( 'allrecipes' )
} )

// router.get('/hack', (req, res) => {
//   res.render('allrecipes')
// })

router.post( '/hack', ( req, res ) => {
  const {
    ingredients
  } = req.body



  console.log( ingredients );
  res.send( 'qualquer coisa' )
  axios.get( `https://api.spoonacular.com/recipes/search?query=${ingredients}&number=100&apiKey=c56a2c3dc10f4cd48c4c94ddb1d371c0` )
    .then( resp => {
      resp.data.results.forEach( recipe => {
        const {
          title,
          readyInMinutes,
          image,
          id
        } = recipe
        Recipe.create( {
          title,
          readyInMinutes,
          image,
          id
        } )
        console.log( 'receita criada com sucesso' );
      } )
      res.render( 'hack' )
    } )
    .catch( err => console.log( err ) )
} )


//testando
// router.get('/teste', (req, res) => {
//   res.render('teste')
// })

router.get( '/teste', ( req, res ) => {
  let ingredient = req.query.ingredients

  console.log(ingredient)
  const apiUrlOneIngredient = `https://api.spoonacular.com/recipes/search?query=${ingredient[0]}${apiUrlFinal}`
  const apiUrlTwoIngredients = `https://api.spoonacular.com/recipes/search?query=${ingredient[0]}&query=${ingredient[1]}${apiUrlFinal}` 
  const apiUrl = `https://api.spoonacular.com/recipes/search?query=${ingredient[0]}&query=${ingredient[1]}&query=${ingredient[2]}${apiUrlFinal}`
  console.log(apiUrl)

  axios.get(apiUrl)
  .then( resp => {
      resp.data.results.forEach( recipe => {
          const { title,readyInMinutes,image,id } = recipe
          Recipe.create( { title, readyInMinutes, image, id } )
          console.log('receita criada com sucesso');
      })
      res.render('teste')
  })
  .catch( err => console.log(err))
} )

//trying to get the results from the API
router.get( '/api-results', ( req, res ) => {
  res.render( 'apiResults' )
} )
module.exports = router;