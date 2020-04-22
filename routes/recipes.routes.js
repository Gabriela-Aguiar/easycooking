var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/recipes/search?query=`
const apiUrlFinal = `&number=100&apiKey=${token}`
const apiUrlFinalRecipeById = `&apiKey=${token}`
const User = require( '../Models/users' )
const axios = require( 'axios' );
const Recipe = require( '../Models/recipeSchema' )
const getRecipes = require( '../Models/getRecipes' )
const getRecipeById = require( '../Models/getRecipeById' )
const myRecipes = require( '../Models/myRecipes' )
const ensureLogin = require( "connect-ensure-login" );


let recipeIdsArr = []

router.get('/allrecipes', (req, res) => {
  res.render('allrecipes')
})

router.get( '/explore-recipes', ( req, res ) => {
  // console.log(req.query);
  const resultado = [];
  let ingredient = req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1)

  if(ingredient == undefined){
    res.render('allrecipes')
  }
  getRecipes
  .find()
  .then(results => {
      results.forEach(item => {
        if(item.title.includes(ingredient)){
            resultado.push(item)
          }
        });
      res.render( 'allrecipes', {resultado: resultado.slice(0, 12)} )
  })
  .catch(error => console.log(error))
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
  let recipeIdList = []
  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient[0]},+${ingredient[1]},+${ingredient[2]}${apiUrlFinal}`

  axios.get( apiUrl )
    .then( resp => {
      resp.data.forEach( recipe => {
        const {
          title,
          image,
          id,
          likes
        } = recipe

        recipeList.push( recipe )
        recipeIdList.push( id )
      } )

      //buscar no banco e filtrar somente as que vão pro insertMany
      getRecipes.find( {
          id: {
            $in: recipeIdList
          }
        } )
        .then( recipesFromDB => {
          console.log( 'RECEITAS DO FIND', recipesFromDB.length )

          //se todas as receitas já existem no banco, só renderizar as receitas
          if ( recipesFromDB.length === recipeIdList.length ) {
            console.log( 'CAI NO IFFFFFFFFFFFFFFFFFFFF' )
            res.render( "searchResults", {
              recipesFromDB
            } )
          }
          //se as receitas não existem no bd 
          else {
            //pegar os ids que já existem no banco de dados
            let recipesIdFromDB = recipesFromDB.map( elem => elem.id )
            let recipeListFiltered = []

            //filtrar os ids que não estão no banco para enviar pro insertmany
            recipeListFiltered = recipeList.filter( recipeFiltered => {
              return !recipesIdFromDB.includes( recipeFiltered.id )
            } )
            // console.log(recipeListFiltered)

            //inserir somente receitas que não existem no banco
            getRecipes.insertMany( recipeListFiltered, {
                ordered: false
              } )
              .then( recipe => {
                console.log( 'CAI NO ELSSSSEEEEEEEEEEEEEEEE' )

                //juntar receitas que existem no banco com as que foram inseridas
                recipesFromDB = [ ...recipesFromDB, ...recipe ]

                res.render( "searchResults", {
                  recipesFromDB
                } )
              } )
              .catch( _ => {
                res.render( 'searchResults', {
                  recipeList
                } )
              } )
          }
        } )
        .catch( error => console.log( 'error CATCH FIND' ) )
    } )
    .catch( error => console.log( 'error CATCH AXIOS' ) )
} )

router.get( '/recipe/:id', ( req, res ) => {
  const id = req.params.id
  let recipeObjectFromAPI = {}
  let recipeObjectFromAPIArr = []

  const apiUrl = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false${apiUrlFinalRecipeById}`

  axios.get( apiUrl )
    .then( resp => {

      const {
        title,
        id,
        image,
        readyInMinutes,
        servings,
        summary,
        aggregateLikes,
        instructions
      } = resp.data

      const {
        name,
        amount,
        unit
      } = resp.data.extendedIngredients

      resp.data.extendedIngredients.forEach( ingredientsFromExtendedIngredients => {
        const {
          name,
          amount,
          unit
        } = ingredientsFromExtendedIngredients

        extendedIngredientsToDB = {
          name,
          amount,
          unit
        }

        recipeObjectFromAPIArr.push( extendedIngredientsToDB )
      } )

      recipeObjectFromAPI = {
        title,
        id,
        image,
        readyInMinutes,
        servings,
        summary,
        aggregateLikes,
        extendedIngredients: recipeObjectFromAPIArr,
        instructions
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
          extendedIngredients: recipeObjectFromAPIArr,
          instructions
        } )
        .then( receita => {
          console.log( name, amount, unit )
          recipeIdsArr.push( id )
          res.render( 'recipeById', {
            recipeObjectFromAPI
          } )
        } )
        .catch( error => {
          console.log( extendedIngredientsToDB )
          res.render( 'recipeById', {
            recipeObjectFromAPI
          } )
        } )
    } )
    .catch( error => {
      console.log( error )
      res.redirect( '/error' )
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
          res.redirect( '/my-recipes' )
        } )
        .catch( error => console.log( error ) )
    } )
    .catch( error => console.log( error ) )
} )

router.get( '/my-recipes', ( req, res ) => {
  myRecipes
    .find( {
      owner: req.user._id
    } )
    .then( recipes => {
      res.render( 'myRecipes', {
        recipes
      } )
      console.log( 'cai no then' );
    } )
    .catch( error => console.log( error ) )
} )


router.get( '/recipes-copy', ( req, res ) => {
  let recipeIdFromDb = []
  let {
    id
  } = req.query

  getRecipeById
    .find( {
      id: id
    } )
    .then( recipe => {
      console.log( recipe );
      const {
        title,
        image,
        readyInMinutes,
        id,
        summary,
        servings,
        aggregateLikes,
        instructions,
        extendedIngredients
      } = recipe[ 0 ]
      // console.log(title);

      recipeIdFromDb.push( id )

      myRecipes
        .create( {
          title,
          image,
          readyInMinutes,
          id,
          summary,
          servings,
          aggregateLikes,
          instructions,
          extendedIngredients,
          owner: req.user._id
        }, () => {
          myRecipes
            .find( {
              owner: req.user._id
            } )
            .then( recipes => {
              res.render( 'myRecipes', {
                recipes
              } )
              console.log( 'cai no then' );
            } )
            .catch( error => console.log( error ) )
        } )
    } )
    .catch( error => console.log( error ) )
} )

router.get( '/my-account/:user', ( req, res ) => {
  console.log( req.params.user );
  User
    .findById( req.params.user )
    .then( user => {
      res.render( 'myAccount', {
        user
      } )
    } )
    .catch( error => console.log( error ) )
} )


router.get( '/edit-recipes', ( req, res ) => {
  // console.log( req.query.id )

  myRecipes.findOne( {
      id: req.query.id
    } )
    .then( recipe => {
      res.render( 'editRecipes', {
        recipe
      } )
    } )
    .catch( error => console.log( error ) )
} )

router.post( '/edit-recipes', ( req, res ) => {

  const extendedIngredients = []

  const {
    id
  } = req.query

  const {
    summary,
    instructions,
    name,
    unit,
    amount
  } = req.body


  for ( i = 0; i < req.body.amount.length; i++ ) {
    extendedIngredients.push( {
      name: req.body.name[ i ],
      amount: req.body.amount[ i ],
      unit: req.body.unit[ i ]
    } )
  }

  myRecipes.findOneAndUpdate( {
      id: id,
      owner: req.user._id
    }, {
      summary,
      extendedIngredients,
      instructions
    }, {
      new: true
    } )
    .then( recipe => {
      res.render( 'editRecipes', {
        recipe
      } )
    } )
    .catch( error => console.log( error ) )
} )

router.get( '/remove-recipe/:id', ( req, res ) => {
  const {
    id
  } = req.params

  myRecipes.findOneAndRemove( {
      id: id,
      owner: req.user._id
    } )
    .then( res.render( 'myRecipes' ) )
    .catch( console.log( `caí no catch` ) )
} )


module.exports = router;