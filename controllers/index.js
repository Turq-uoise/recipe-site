const Recipe = require('../models/recipe');

function index(req, res, next) {
    let recipe = Recipe.find();
    res.render('index', {recipe});
}
  
module.exports = {
    index
}