const mongoose = require('mongoose')
const getrecipes = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    id: {
        type: String,
    },
    likes: {
        type: Number
    }
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})


module.exports = mongoose.model('getRecipes', getrecipes)