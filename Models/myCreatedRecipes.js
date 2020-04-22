const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const myCreatedRecipesSchema = new mongoose.Schema( {
	title: {
		type: String,
	},
	image: {
		type: String,
    default: "/images/chef.png"
	},
	readyInMinutes: {
		type: Number,
	},
	summary: {
		type: String
	},
	servings: {
		type: Number
	},
	aggregateLikes: {
		type: Number,
    default: 0
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

module.exports = mongoose.model( 'MyCreatedRecipes', myCreatedRecipesSchema )