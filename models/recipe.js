const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	userName: String,
	userAvatar: String
}, {
	timestamps: true
});

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	userName: String,
  userAvatar: String,
  dishType: {
		type: String, 
		required: true,
	},
  ingredients: [{
		type: Schema.Types.ObjectId,
		ref: 'Ingredient'
	}],
  cuisine: {
		type: String, 
		required: true,
	},
  dietType: {
		type: String, 
		default: "N/A",
	},
  healthType: {
		type: String, 
		default: "N/A",
	},
  method: {
		type: String, 
		required: true,
	},
  comments: [commentSchema],
  likes: Number,
  posted: Date
});

module.exports = mongoose.model('Recipe', recipeSchema);