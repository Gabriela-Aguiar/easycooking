const mongoose = require('mongoose')
const recipeSchema = new mongoose.Schema({
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
    }
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})


module.exports = mongoose.model('Recipe', recipeSchema)