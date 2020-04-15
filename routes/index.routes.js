var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`
const apiUrlFinal = `&number=100&apiKey=${token}`

const User = require( '../Models/users' )
const axios = require( 'axios' );
const Recipe = require( '../Models/recipeSchema' )
let recipeIdsArr = []

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', );
} );

router.get( '/allrecipes', ( req, res ) => {
  res.render( 'allrecipes' )
} )


router.get( '/teste', ( req, res ) => {
  let ingredient = req.query.ingredients

  console.log( ingredient )
  const apiUrl = `https://api.spoonacular.com/recipes/search?query=${ingredient[0]}&query=${ingredient[1]}&query=${ingredient[2]}${apiUrlFinal}`
  console.log( apiUrl )

  axios.get( apiUrl )
    .then( resp => {
      resp.data.results.forEach( recipe => {
        const {
          title,
          readyInMinutes,
          image,
          id
        } = recipe

        //check if id is already in the db
        if ( recipeIdsArr.includes( id ) ) return

        Recipe.create( {
          title,
          readyInMinutes,
          image,
          id
        } )
        recipeIdsArr.push( id )
        console.log( 'receita criada com sucesso' );
      } )
      res.render( 'teste' )
    } )
    .catch( err => console.log( err ) )
} )

router.get( '/api-results', ( req, res ) => {
  res.render( 'apiResults' )
} )
module.exports = router;