var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`
const apiUrlFinal = `&number=10&apiKey=${token}`

const User = require( '../Models/users' )
const axios = require( 'axios' );
const Recipe = require( '../Models/recipeSchema' )
const getRecipes = require( '../Models/getRecipes' )
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

  // console.log( ingredient )
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
      res.render( 'all' )
    } )
    .catch( err => console.log( err ) )
} )

router.get( '/getrecipes', ( req, res ) => {
  let ingredient = req.query.ingredients;
  let searchedId = [];

  // console.log( ingredient )
  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient[0]},+${ingredient[1]},+${ingredient[2]}${apiUrlFinal}`

  console.log( apiUrl )

  axios.get( apiUrl )
    .then( resp => {
      resp.data.forEach( recipe => {
        console.log( recipe );
        const {
          title,
          image,
          id,
          likes
        } = recipe

        searchedId.push( id );
        console.log( '---------->', searchedId )

        //check if id is already in the db
        if ( recipeIdsArr.includes( id ) ) return

        getRecipes.create( {
          title,
          image,
          id,
          likes
        } )
        recipeIdsArr.push( id )
        // console.log( 'receita criada com sucesso' );
      } )
      getRecipes.find( {
          $or:[{id: searchedId}]  
        } )
        .then( resp => {
          console.log( resp )
          console.log( searchedId )
          res.render( 'all', resp )
        } )
    } )
    .catch( err => console.log( err ) )
} )

module.exports = router;