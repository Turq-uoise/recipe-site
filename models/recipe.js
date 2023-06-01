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
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
  dishType: String,
  ingredients: [{
		type: Schema.Types.ObjectId,
		ref: 'Ingredient'
	}],
  cuisine: String,
  dietType: String,
  healthType: String,
  method: String,
  comments: [commentSchema],
  likes: Number,
  posted: Date
});

module.exports = mongoose.model('Recipe', recipeSchema);