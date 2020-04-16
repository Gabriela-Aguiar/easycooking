var express = require( 'express' );
var router = express.Router();

/* GET home page. */
router.get( '/', ( req, res, next ) => {
  res.render( 'index', );
} );

router.get( '/index', ( req, res, next ) => {
  res.render( 'index1', );
} );

module.exports = router;