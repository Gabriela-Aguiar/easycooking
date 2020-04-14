const router = require('express').Router()
const axios = require('axios');
 
const Recipe = require('../Models/recipeSchema')


router.get('/hack', ( req,res ) => {
    axios.get('https://api.spoonacular.com/recipes/search?query=cheese&number=100&apiKey=c56a2c3dc10f4cd48c4c94ddb1d371c0')
    .then( resp => {
        resp.data.results.forEach( recipe => {
            const { title,readyInMinutes,image,id } = recipe
            Recipe.create( { title, readyInMinutes, image, id } )
        })
        res.send('jakiado')
    })
    .catch( err => console.log(err))
})

router.get('/all', ( req,res ) => {
    console.log('entra al all')
    Recipe.find({})
    .then( recipes => {
        res.render('all', {recipes})
    })
})

module.exports = router;