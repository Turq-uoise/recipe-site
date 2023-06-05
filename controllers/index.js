const Recipe = require('../models/recipe');

async function index(req, res, next) {
    let recipes = await Recipe.find({});
    res.render('index', {recipes});
}
  
module.exports = {
    index
}