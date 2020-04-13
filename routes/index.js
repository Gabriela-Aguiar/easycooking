var express = require( 'express' );
var router = express.Router();
const token = process.env[ 'API_TOKEN' ]
const apiUrl = `https://api.spoonacular.com/food/products/search?query=yogurt&apiKey=${token}`
const User = require( '../Models/users' )

//bcrypt to encrypt password
const bcrypt = require( 'bcrypt' )
const bcryptSalt = 10

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', {
    title: 'EasyCooking'
  } );
} );

router.get( '/login', ( req, res ) => {
  res.render( 'login' )
} )

//USER auth
router.post( '/signup', ( req, res ) => {
  const {
    username,
    email,
    password
  } = req.body


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

      User.create( {
          username,
          email,
          password: hashPass
        } )
        .then( () => {
          res.redirect( '/' )
        } )
        .catch( error => console.log( error ) )
      console.log( req.body )
    } )
} )

router.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body
  console.log(email, password);
  
  User.findOne({'email': email})
  .then(user => {
    if(!user){
      res.render('login', {
        errorMessage: 'The username doesnt exist'
      })
      return;
    }
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;
      res.redirect('/')
    } else {
      res.render('login', {
        errorMessage: 'Incorrect password'
      })
    }
  })
  .catch(error => console.log(error))
})
//trying to get the results from the API
router.get( '/api-results', ( req, res ) => {
  res.render( 'apiResults' )
} )
module.exports = router;