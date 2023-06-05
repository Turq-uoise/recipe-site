const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

module.exports = {
  index,
  show,
  new: newRecipe,
  create
}

async function index(req, res) {
  const recipes = await Recipe.find({});
  const ingredients = await Ingredient.find({});
  res.render('recipes/index', {recipes, ingredients});
}

async function show(req, res) {
  console.log("hello");
  const recipe = await Recipe.findById(req.params.id).populate('ingredients');
  const ingredients = await Ingredient.find({ _id: { $nin: recipe.ingredient } }).sort('name');
  res.render('recipes/show', { title: `${recipe.name}`, recipe, ingredients });
}

async function newRecipe(req, res) {
  const ingredients = await Ingredient.find({}).sort('name');
  res.render('recipes/new', { errorMsg: '', ingredients });
}
 
async function create(req, res) {
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;
  req.body.ingredients = req.body.ingredients.split(/\s*,\s*/);
  for (let i = 0; i < req.body.ingredients.length; i++) {
    let arr = req.body.ingredients[i].split("");
    console.log("arr: " + arr);
    arr[0] = arr[0].toUpperCase();
    const upperCased = arr.join("");
    req.body.ingredients[i] = upperCased;
  }

  console.log("req ingredients: " + req.body.ingredients);

  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }


  const createdIngredients = [];
  const newIngredients = [];
  const filter = { name: { $in: [...req.body.ingredients] } };
  const ingredientsSaved =  [...req.body.ingredients];
  let recipeID;
  
  try {
    req.body.ingredients = [];
    const recipe = await Recipe.create(req.body);
    recipeID = recipe._id;
  } catch (err) {
    let errMsgWithBreaks = err.message.replace(/\.,/g, '<br>');
    errMsgWithBreaks = errMsgWithBreaks.replace(/:/, ': <br>');
    errMsgWithBreaks = errMsgWithBreaks.replace(/E11000 duplicate key error collection: <br> recipe-site.recipes index: name_1 dup key: { name: /, 'A recipe already has the name ');
    errMsgWithBreaks = errMsgWithBreaks.replace(/}/, '');
    return res.render('recipes/new', { errorMsg: errMsgWithBreaks });
  }

  try {
    req.body.ingredients = ingredientsSaved;

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
    return res.render('recipes/new', { errorMsg: errMsgWithBreaks });
  }
}

