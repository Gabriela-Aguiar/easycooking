var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=${token}`
const User = require( '../Models/users' )
const ensureLogin = require("connect-ensure-login");

const passportRouter = express.Router();
const passport = require("passport");

//bcrypt to encrypt password
const bcrypt = require( 'bcrypt' )
const bcryptSalt = 10

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', );
} );

//view for login and signup
router.get( '/login', ( req, res ) => {
  res.render( 'login' )
} )

//USER auth SIGNUP
router.post( '/signup', ( req, res, next ) => {
  const {
    username,
    email,
    password
  } = req.body

  // if (username === "" || password === "") {
  //   res.render("/login", { message: "Indicate username and password" });
  //   return;
  // }

  User.findOne( {
      "username": username
    } )
    .then( user => {
      if ( user !== null ) {
        //TO-DO - enviar uma msg de erro na tela e redirecionar para outra tela
        res.render( "login" ), {
          errorMsg: "The username already exists!"
        }
        return
      }

      const salt = bcrypt.genSaltSync( bcryptSalt );
      const hashPass = bcrypt.hashSync( password, salt );

      const newUser = new User( {
        username,
        email,
        password: hashPass
      } )

      newUser.save( ( err ) => {
          if ( err ) {
            res.render( 'login', {
              message: "Something went wrong"
            } )
          } else {
            res.redirect( '/home' )
          }
        } )
        .catch( error => next( error ) )
    } )
} )

//USER auth LOGIN
router.post( '/login', passport.authenticate("local", {
  successRedirect: "/home", 
  failureRedirect: "/login", 
  failureFlash: true, 
  passReqToCallback: true, 
}))

router.get("/home", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("home", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get('/allrecipes', (req, res) => {
  res.render('allrecipes')
})

//trying to get the results from the API
router.get( '/api-results', ( req, res ) => {
  res.render( 'apiResults' )
} )
module.exports = router;