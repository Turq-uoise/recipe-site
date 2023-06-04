const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

module.exports = {
  index,
  new: newRecipe,
  create
}

async function index(req, res) {
  const recipes = await Recipe.find({});
  res.render('recipes/index', recipes);
}

async function newRecipe(req, res) {
  const ingredients = await Ingredient.find({}).sort('name');
  res.render('recipes/new', { errorMsg: '', ingredients });
}
 
async function create(req, res) {
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;

  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }

  const createdIngredients = [];
  const newIngredients = [];
  const filter = { name: { $in: req.body.ingredients } };
  const ingredientsSaved = req.body.ingredients;
  let recipeID;
  
  try {
    req.body.ingredients = [];
    const recipe = await Recipe.create(req.body);
    recipeID = recipe._id;
  } catch (err) {
    let errMsgWithBreaks = err.message.replace(/\.,/g, '<br>');
    errMsgWithBreaks = errMsgWithBreaks.replace(/:/, ': <br>');
    console.log(errMsgWithBreaks);
    res.render('recipes/new', { errorMsg: errMsgWithBreaks });
  }

  try {
    req.body.ingredients = ingredientsSaved;
    req.body.ingredients = req.body.ingredients.split(/\s*,\s*/);
    // Figure out which of the inputted ingredients aren't already in the Schema
    Ingredient.find(filter).then(async existingIngredients => {
      const existingIngredientNames = existingIngredients.map(ingredient => ingredient.name);
      newIngredients.push(...req.body.ingredients.filter(name => !existingIngredientNames.includes(name)));
      console.log("new Ingredients: " + newIngredients);

    // Add each new inputted ingredient into the Schema
      newIngredients.forEach(name => {
        const ingredient = new Ingredient({ name });
        createdIngredients.push(ingredient);
      });

      console.log("createdIngredients: " + createdIngredients);

      await Ingredient.create(createdIngredients);

      const addedIngredients = await Ingredient.find(filter);

      const recipe = await Recipe.findById(recipeID);

      console.log(recipe);

      addedIngredients.forEach(ingredient => {
        recipe.ingredients.push(ingredients.ingredientId)
      })

      await recipe.save();
      res.redirect(`/recipes/${recipe._id}`);
    });

  } catch (err) {
    let errMsgWithBreaks = err.message.replace(/\,/g, '<br>');
    errMsgWithBreaks = errMsgWithBreaks.replace(/:/, ': <br>');
  }
  

}

