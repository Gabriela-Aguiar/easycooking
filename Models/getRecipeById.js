const mongoose = require( 'mongoose' )
const getRecipeById = new mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    readyInMinutes: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        unique: true
    },
    summary: {
        type: String
    },
    servings: {
        type: Number
    },
    aggregateLikes: {
        type: Number
    },
    instructions: {
        type: String,
        default: "Unfotunately we do not have instructions on how to prepare the recipe above in our database. If you have any idea on how to prepare the recipe please contact us. You can also fork the recipe and add your own instructions."
    },
    extendedIngredients: [ {
        name: String,
        amount: Number,
        unit: String
    } ],
    
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
} )


module.exports = mongoose.model( 'RecipeID', getRecipeById)