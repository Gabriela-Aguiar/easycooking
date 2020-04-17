require('dotenv').config();
const bodyParser = require('body-parser');
const createError = require( 'http-errors' );
const express = require( 'express' );
const path = require( 'path' );
const hbs = require('hbs');
const cookieParser = require( 'cookie-parser' );
const logger = require( 'morgan' );
const app = express();
const indexRouter = require( './routes/index.routes' );
const recipesRouter = require('./routes/recipes.routes')
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt"); 
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const auth = require('./routes/auth.routes')
const User = require( './Models/users' )

//database information
const mongoose = require( 'mongoose' )
const dbUrl = '//localhost/'
const dbName = 'easyCooking'

//add mongo database
mongoose
.connect( process.env.MONGODB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
} )
mongoose.connection.on('connected', () => console.log(`Connected to Mongo! Database name: ${dbName}`))
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  })
})

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));
// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hbs' );

// Middleware Setup
app.use(session({ 
  secret: "our-passport-local-strategy-app", 
  resave: true, 
  saveUninitialized: true,
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash()); 
passport.use(new LocalStrategy({
 passReqToCallback: true }, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

app.use(passport.initialize()); 
app.use(passport.session());

app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( {
  extended: false
} ) );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( cookieParser() );
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', indexRouter );
app.use('/', recipesRouter);
app.use('/', auth)


// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
  next( createError( 404 ) );
} );

// error handler
app.use( function ( err, req, res, next ) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

  // render the error page
  res.status( err.status || 500 );
  res.render( 'error' );
} );


module.exports = app;