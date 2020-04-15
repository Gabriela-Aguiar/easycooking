var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`
const apiUrlFinal = `&number=10&apiKey=${token}`
const apiUrlFinalRecipeById = `&apiKey=${token}`


const User = require( '../Models/users' )
const axios = require( 'axios' );
const Recipe = require( '../Models/recipeSchema' )
const getRecipes = require( '../Models/getRecipes' )
const getRecipeById = require( '../Models/getRecipeById' )

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
          $or: [ {
            id: searchedId
          } ]
        } )
        .then( resp => {
          // console.log( resp )
          // console.log( searchedId )
          res.render( 'all', resp )
        } )
    } )
    .catch( err => console.log( err ) )
} )

router.get( '/recipe/:id', ( req, res ) => {
  const id = req.params.id

  // console.log( id )
  const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false${apiUrlFinalRecipeById}`

  // console.log( apiUrl )
  // res.render( 'recipeById' )

  axios.get( apiUrl )
    .then( resp => {
      // let recipeByIdArr = [ resp.data ]
      // console.log( recipeByIdArr )

      const {
        title,
        id,
        image,
        readyInMinutes,
        servings,
        summary,
        aggregateLikes
      } = resp.data

      const {
        name,
        amount,
        unit
      } = resp.data.extendedIngredients[ 0 ]

      // searchedId.push( id );
      // console.log( '---------->', searchedId )

      //check if id is already in the db
      if ( recipeIdsArr.includes( id ) ) return

      getRecipeById
        .create( {
          title,
          id,
          image,
          readyInMinutes,
          servings,
          summary,
          aggregateLikes,
          extendedIngredients: [ {
            name: name,
            amount: amount,
            unit: unit
          } ]
        } )
        .then( receita => {
          console.log( '****************', receita )
          res.render( 'recipeById', {
            receita
          } )
        } )
        .catch( error => {
          console.log( error )
        } )
    } )
} )

module.exports = router;