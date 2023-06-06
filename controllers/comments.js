const Recipe = require('../models/recipe');

module.exports = {
  create,
  delete: deleteComment,
  update
};

async function deleteComment(req, res) {
  const recipe = await Recipe.findOne({ 'comments._id': req.params.id, 'comments.user': req.user._id });
  if (!recipe) return res.redirect('/recipes');
  recipe.comments.remove(req.params.id);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
}

async function create(req, res) {
  const recipe = await Recipe.findById(req.params.id);

  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;

  recipe.comments.push(req.body);
  try {
    await recipe.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/recipes/${recipe._id}`);
}

async function update (req, res){
  const recipe = await Recipe.findOne({ 'comments._id': req.params.id});
  const comment = recipe.comments.id(req.params.id);
  if (comment.likedBy.includes(req.user._id)) return res.redirect(`/recipes/${recipe._id}`);
  comment.likes++;
  comment.likedBy.push(req.user._id);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
}