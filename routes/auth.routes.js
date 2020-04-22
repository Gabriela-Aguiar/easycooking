const express = require( 'express' );
const router = express.Router();
const User = require( '../Models/users' )
const ensureLogin = require( "connect-ensure-login" );
const nodemailer = require( 'nodemailer' );
const template = require( '../templates/welcomeTemplate' )
const resetTemplate = require( '../templates/resetTemplate' )
require( 'dotenv' ).config()

//passport
const passport = require( "passport" );

//bcrypt to encrypt password
const bcrypt = require( 'bcrypt' )
const bcryptSalt = 10

//view for login and signup
router.get( '/login', ( req, res ) => {
	res.render( 'login', {
		messageLogin: req.flash().error
	} )
} )

//USER auth SIGNUP
router.post( '/signup', ( req, res, next ) => {
	const {
		name,
		username,
		email,
		password
	} = req.body

	if ( username === "" || password === "" ) {
		res.render( 'login', {
			message: "Indicate username and password"
		} );
		return;
	}

	User.findOne( {
			"username": username
		} )

		.then( user => {
			if ( user !== null ) {
				res.render( "login", {
					message: "The username already exists"
				} );
				return;
			}

			const salt = bcrypt.genSaltSync( bcryptSalt );
			const hashPass = bcrypt.hashSync( password, salt );

			const newUser = new User( {
				name,
				username,
				email,
				password: hashPass
			} )

			newUser.save()
				.then( user => {
					console.log( user )
					req.login( user, ( err ) => {
						if ( err ) {
							res.redirect( '/login' )
						} else {
							sendEmail( email, 'Welcome', 'Welcome to easyCooking', 'welcome', username )
							res.redirect( '/home' )
						}
					} )
				} )
				.catch( error => res.render( 'login', {
					message: "Something went wrong"
				} ) )
				.catch( error => next( error ) )
		} )
} )

//USER auth LOGIN
router.post( '/login', passport.authenticate( "local", {
	successRedirect: "/home",
	failureRedirect: "/login",
	failureFlash: true,
	passReqToCallback: true,
} ) )

router.get( "/home", ensureLogin.ensureLoggedIn(), ( req, res ) => {
	res.render( "home", {
		user: req.user
	} );
} );

router.get( "/logout", ( req, res ) => {
	req.logout();
	res.redirect( "/login" );
} );

router.get( '/resetPassword', ( req, res ) => {
	res.render( 'resetPassword' )
} )

router.post( '/resetPassword', ( req, res ) => {
	// console.log(req.body.email);
	const {
		email
	} = req.body
	// console.log(email);
	User
		.find( {
			email
		} )
		.then( user => {
			console.log( user[ 0 ] );
			sendEmail( user[ 0 ].email, 'Reset Password', 'Reset your password', 'reset', user[ 0 ]._id, user[ 0 ].username );
		} )
		.catch( err => console.log( err ) )

} )

router.get( '/about', ( req, res ) => {
	res.render( 'aboutUs' )
} )


// router.get('/email', ( req,res ) => {
//     sendEmail('aguiar.gabi95@gmail.com', 'Reset your password', 'Reset your password', 'reset', 'gabi')
//     res.send( 'enviado' )
// })

router.get( '/resetpassword/:id', ( req, res ) => {
	const {
		id
	} = req.params
	res.render( 'userPassword', {
		id
	} )
} )

router.post( '/resetpassword/:id', ( req, res ) => {
	const {
		id
	} = req.params
	const {
		password,
		confirm
	} = req.body

	if ( password === confirm ) {
		const salt = bcrypt.genSaltSync( bcryptSalt );
		const hashPass = bcrypt.hashSync( password, salt );
		User
			.findOneAndUpdate( {
				_id: id
			}, {
				$set: {
					password: hashPass,
				}
			}, {
				new: true
			} )
			.then( user => {
				res.redirect( '/login' )
			} )
			.catch( err => console.log( err ) )
	} else {
		res.send( 'error' )
	}
} )

async function sendEmail( to, subject, text, html, username, id ) {

	if ( html === 'welcome' ) {
		html = template( username )
	} else if ( html === 'reset' ) {
		// console.log('-----------------reset');
		html = resetTemplate( username )
	}
	let transporter = nodemailer.createTransport( {
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.email,
			pass: process.env.password
		}
	} );

	// send mail with defined transport object
	let info = await transporter.sendMail( {
		from: 'easycooking.app2020@gmail.com', // sender address
		to, // list of receivers
		subject, // Subject line
		text, // plain text body
		html // html body
	} );

	console.log( "Message sent: %s", info.messageId );
	console.log( "Preview URL: %s", nodemailer.getTestMessageUrl( info ) );
}

module.exports = router;