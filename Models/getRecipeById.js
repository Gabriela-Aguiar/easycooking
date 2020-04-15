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
        type: String
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
    extendedIngredients: [ {
        name: String,
        amount: Number,
        unit: String
    } ]
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
} )


module.exports = mongoose.model( 'RecipeID', getRecipeById )