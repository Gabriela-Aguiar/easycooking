var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`
const apiUrlFinal = `&number=12&apiKey=${token}`
const apiUrlFinalRecipeById = `&apiKey=${token}`
const User = require( '../Models/users' )
const axios = require( 'axios' );
const Recipe = require( '../Models/recipeSchema' )
const getRecipes = require( '../Models/getRecipes' )
const getRecipeById = require( '../Models/getRecipeById' )
const ensureLogin = require( "connect-ensure-login" );


let recipeIdsArr = []

router.get( '/allrecipes', ( req, res ) => {
  res.render( 'allrecipes' )
} )

router.get( '/teste', ( req, res ) => {
  let ingredient = req.query.ingredients
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
      res.render( 'searchResults' )
    } )
    .catch( err => console.log( '---- ', err ) )
} )

router.get( '/getrecipes', ( req, res ) => {
  let ingredient = req.query.ingredients;
  let recipeList = [];
  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient[0]},+${ingredient[1]},+${ingredient[2]}${apiUrlFinal}`

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

        recipeList.push( recipe )
      } )

      //buscar no banco e filtrar somente as que vão pro insertMany
      // getRecipes.find()

      getRecipes.insertMany( recipeList, {
          ordered: false
        } )
        .then( recipe => {
          console.log('página renderizada pelo then')
          res.render( "searchResults", {
            recipeList
          } )
        } )
        .catch( _ => {
          console.log('página renderizada pelo catch')
          res.render( 'searchResults', {
            recipeList
          } )
        } )
    } )
} )


router.get( '/recipe/:id', ( req, res ) => {
  const id = req.params.id
  let recipeObjectFromAPI = {}

  const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false${apiUrlFinalRecipeById}`
  // const apiUrlInstructions = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions${apiUrlFinalRecipeById}`

  axios.get( apiUrl )
    .then( resp => {

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

      recipeObjectFromAPI = {
        title,
        id,
        image,
        readyInMinutes,
        servings,
        summary,
        aggregateLikes,
        name,
        amount,
        unit
      }

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
          recipeIdsArr.push( id )
          res.render( 'recipeById', {
            recipeObjectFromAPI
          } )
        } )
        .catch( error => {
          res.render( 'recipeById', {
            recipeObjectFromAPI
          } )
        } )
    } )
    .catch( error => {
      console.log( error )
      res.redirect('/error')
    } )
} )

router.post( '/updatelikes', ( req, res ) => {
  let {
    id,
  } = req.body
  console.log( req.body )

  getRecipes.find( {
      id: id
    } )
    .then( receita => {
      let {
        likes
      } = receita[ 0 ]

      getRecipes.findOneAndUpdate( {
          id: id
        }, {
          $set: {
            likes: likes += 1
          }
        }, {
          new: true
        } )
        .then( _ => {
          res.redirect('/my-recipes')
        } )
        .catch( error => console.log( error ) )
    } )
    .catch( error => console.log( error ) )
} )

router.get('/my-recipes', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('myRecipes')
})

router.get('/my-account/:user', (req, res) => {
  console.log(req.params.user);
  User
  .findById(req.params.user)
  .then(user => {
    res.render('myAccount', {user})
  })
  .catch(error => console.log(error))
  
})




module.exports = router;