const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	content: {
		type: String,
		required: true
	},
	rating: Number,
	likes: { 
		type: Number, 
		default: 0
	},
	likedBy: [{ 
		type: Schema.Types.ObjectId,
		ref: 'User' 
	}],
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
  dietType: String,
  healthType: String,
  method: {
		type: String, 
		required: true,
	},
  comments: [commentSchema],
  posted: {type: Date, default: Date.now}
});

recipeSchema.index({ingredients: 'text'})

module.exports = mongoose.model('Recipe', recipeSchema);