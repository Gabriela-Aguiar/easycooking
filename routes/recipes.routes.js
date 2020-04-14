const router = require('express').Router()
const axios = require('axios');
// const teste = require('../public/javascripts/index')
 
const Recipe = require('../Models/recipeSchema')




router.get('/all', ( req,res ) => {
    Recipe.find({})
    .then( recipes => {
        res.render('all', {recipes})
    })
})

module.exports = router;