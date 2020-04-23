const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    unique:true
  },
  password: {
    type: String
  },
  email: {
    type: String,
  },
  name: {
    type: String
  },
  imgName: {
		type: String,
	},
	imgPath: {
		type: String,
    default: "/images/chef.png"
  },
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

const User = mongoose.model('User', userSchema)

module.exports = User