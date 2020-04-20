const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const myRecipesSchema = new mongoose.Schema( {
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    readyInMinutes: {
        type: Number,
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
        type: ObjectId,
        ref: 'User'
    } ],
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
} )

module.exports = mongoose.model( 'MyRecipes', myRecipesSchema )