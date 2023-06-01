const Recipe = require('../models/recipe');

module.exports = {
    index,
    new: newRecipe
}

async function index(req, res) {
    const recipes = await Recipe.find({});
    res.render('recipes/index', recipes);
}

function newRecipe(req, res) {
    res.render('recipes/new', { errorMsg: '' });
  }
  