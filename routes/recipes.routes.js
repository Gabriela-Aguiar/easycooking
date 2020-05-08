const express = require( 'express' );
const router = express.Router();
const ensureLogin = require( "connect-ensure-login" );
const uploadCloud = require( '../config/cloudinary' );
const recipesController = require( '../controllers/recipesController' );

router.get( '/allrecipes', recipesController.getAllRecipes)

router.get( '/explore-recipes', recipesController.getExploreRecipes)

router.get( '/getrecipes', ensureLogin.ensureLoggedIn(), recipesController.getRecipes)

router.get( '/recipe/:id', ensureLogin.ensureLoggedIn(), recipesController.getSpecificRecipe)

router.post( '/updatelikes/:id', recipesController.postUpdateLikes)

router.get( '/my-recipes', ensureLogin.ensureLoggedIn(), recipesController.getMyRecipes)

router.get( '/recipes-copy', ensureLogin.ensureLoggedIn(), recipesController.getRecipesCopy)

router.get( '/my-account/:user', ensureLogin.ensureLoggedIn(), recipesController.getUser)

router.post( '/my-account/avatar', uploadCloud.single( 'photo' ), recipesController.postUserAvatar)

router.get( '/edit-recipes', ensureLogin.ensureLoggedIn(), recipesController.getEditRecipes )

router.post( '/edit-recipes', recipesController.postEditRecipes)

router.get( '/edit-createdRecipes', ensureLogin.ensureLoggedIn(), recipesController.getEditCreatedRecipes)

router.post( '/edit-createdRecipes', recipesController.getEditCreatedRecipes)

router.get( '/remove-recipe/:id', ensureLogin.ensureLoggedIn(), recipesController.getRemoveRecipe)

router.get( '/remove-createdRecipe/:id', ensureLogin.ensureLoggedIn(), recipesController.getRemoveCreatedRecipe)

router.get( '/add-recipe', ensureLogin.ensureLoggedIn(), recipesController.getAddRecipe);

router.post( '/add-recipe', uploadCloud.single( 'photo' ), recipesController.postAddRecipe)

router.post( '/add-recipe', uploadCloud.single( 'photo' ), recipesController.postAddRecipe)



module.exports = router;