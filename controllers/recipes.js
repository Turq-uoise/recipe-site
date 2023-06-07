const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

module.exports = {
  index,
  show,
  new: newRecipe,
  search,
  create
}

async function index(req, res) {
  let recipes;
  const ingredients = await Ingredient.find();
  if (req.query.ingredient){ // if ingredient query string exists, use it to show results containing this ingredient
    recipes = await Recipe.find({ ingredients: req.query.ingredient }); // check for searched ingredient
    console.log(recipes);
  } else { // otherwise if no ingredient query string passed, show all
    res.render('recipes/index', { errorMsg: '', ingredients });
  }
  return res.render('recipes/search', { errorMsg: '', recipes, ingredients });
}

// async function index(req, res) {
//   console.log('req.query.ingredient ->', req.query.ingredient) // 646f54e1361978ca83f089d4 (id of the ingredient)
//   let recipes
//   if(req.query.ingredient){ // if ingredient query string exists, use it to show results containing this ingredient
//     recipes = await Recipe.find({ ingredients: req.query.ingredient }); // check for searched ingredient
//   } else { // otherwise if no ingredient query string passed, show all
//     recipes = await Recipe.find();
//   }
  
//   res.render('recipes/index', { title: 'All Recipes', recipes });
// }

async function show(req, res) {
  const recipe = await Recipe.findById(req.params.id).populate('ingredients');
  const ingredients = await Ingredient.find({ _id: { $nin: recipe.ingredient } }).sort('name');
  res.render('recipes/show', { title: `${recipe.name}`, recipe, ingredients });
}

async function newRecipe(req, res) {
  const ingredients = await Ingredient.find({}).sort('name');
  const cuisine = ["American", "Asian", "British", "Caribbean", "Central Europe", "Chinese", "Eastern Europe", "French", "Greek", "Indian", "Italian", "Japanese", "Korean", "Kosher", "Mediterranean", "Mexican", "Middle Eastern", "Nordic", "South American", "South East Asian", "World", "Other"];
  const dishType =  ["Alcohol Cocktail", "Biscuits And Cookies", "Bread", "Cereals", "Condiments And Sauces", "Desserts", "Drinks", "Egg", "Ice Cream And Custard", "Main Course", "Pancake", "Pasta", "Pastry", "Pies And Tarts", "Pizza", "Preps", "Preserve", "Salad", "Sandwiches", "Seafood", "Side Dish", "Soup", "Special Occasions", "Starter", "Sweets"];
  res.render('recipes/new', { errorMsg: '', ingredients, cuisine, dishType });
}
 
async function search(req, res) {
  const ingredients = await Ingredient.find({});

  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }

  if (!req.body.ingredients) return res.render('recipes', { errorMsg: 'Please enter some ingredients.', ingredients })
  req.body.ingredients = req.body.ingredients.replace(/[,\s]+$/, '').split(/\s*,\s*/);

  Ingredient.find({ name: { $in: req.body.ingredients } })
  .then((ingredients) => {
    // Get the ObjectIds of the matching ingredients
    const ingredientIds = ingredients.map((ingredient) => ingredient._id);

    // Search for recipes that have any of the matching ingredient ObjectIds
    return Recipe.find({ ingredients: { $all: ingredientIds } }).populate('ingredients');
  })
  .then((recipes) => {
    // Process the search results
    if (recipes.length === 0) {
      res.render('recipes', { errorMsg : 'There are no recipes with all of those ingredients.', ingredients });
    } else {
      res.render('recipes/search', { recipes, errorMsg: '' });
    }
  })
  .catch((err) => {
    // Handle the error
    let errMsgWithBreaks = err.message.replace(/\.,/g, '<br>')
    .replace(/:/, ': <br>')
    .replace(/E11000 duplicate key error collection: <br> recipe-site.recipes index: name_1 dup key: { name: /, 'A recipe already has the name ')
    .replace(/}/, '');
    res.render('recipes', { errorMsg: errMsgWithBreaks, ingredients});
  });
}

async function create(req, res) {
  const ingredients = await Ingredient.find({}).sort('name');
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;
  req.body.ingredients = req.body.ingredients.replace(/[,\s]+$/, '').split(/\s*,\s*/);

  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }

  const ingredientsSaved =  [...req.body.ingredients];
  let recipeID;
  
  try {
    req.body.ingredients = [];
    const recipe = await Recipe.create(req.body);
    recipeID = recipe._id;
  } catch (err) {
    let errMsgWithBreaks = err.message.replace(/\.,/g, '<br>')
    .replace(/:/, ': <br>')
    .replace(/E11000 duplicate key error collection: <br> recipe-site.recipes index: name_1 dup key: { name: /, 'A recipe already has the name ')
    .replace(/}/, '');
    return res.render('recipes/new', { errorMsg: errMsgWithBreaks, ingredients});
  }

  req.body.ingredients = ingredientsSaved;
  const createdIngredients = [];
  const newIngredients = [];
  const filter = { name: { $in: [...req.body.ingredients] } };
  
  for (let i = 0; i < req.body.ingredients.length; i++) {
    let arr = req.body.ingredients[i].split("");
    arr[0] = arr[0].toUpperCase();
    const upperCased = arr.join("");
    req.body.ingredients[i] = upperCased;
  }

  try {


    // Figure out which of the inputted ingredients aren't already in the Schema
    Ingredient.find(filter).then(async existingIngredients => {
      const existingIngredientNames = existingIngredients.map(ingredient => ingredient.name);
      newIngredients.push(...req.body.ingredients.filter(name => !existingIngredientNames.includes(name)));

    // Add each new inputted ingredient into the Schema
      newIngredients.forEach(name => {
        const ingredient = { name };
        createdIngredients.push(ingredient);
      });

      await Ingredient.create(createdIngredients);

      const addedIngredients = await Ingredient.find(filter);

      const recipe = await Recipe.findById(recipeID);

      addedIngredients.forEach(async ingredient => {
        recipe.ingredients.push(ingredient._id);
      })

      await recipe.save();     
      return res.redirect(`/recipes`);
    });

  } catch (err) {
    let errMsgWithBreaks = err.message.replace(/\,/g, '<br>');
    errMsgWithBreaks = errMsgWithBreaks.replace(/:/, ': <br>');
    return res.render('recipes/new', { errorMsg: errMsgWithBreaks, ingredients });
  }
}

