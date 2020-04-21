const mongoose = require( 'mongoose' )
const getRecipeByIdWithOwner = new mongoose.Schema( {
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
        type: String
    },
    extendedIngredients: [ {
        name: String,
        amount: Number,
        unit: String
    } ],
    owner: [ {
        type: Schema.Types.ObjectId,
        ref: 'User'
    } ],
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
} )

module.exports = mongoose.model( 'MyRecipes', getRecipeByIdWithOwner )