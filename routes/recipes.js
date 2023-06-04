const express = require('express');
const router = express.Router();
// You'll be creating this controller module next
const recipesCtrl = require('../controllers/recipes');
const ensureLoggedIn = require('../config/ensureLoggedIn');
	
// GET /recipes
router.get('/', recipesCtrl.index);
// GET /recipes/new
router.get('/new', ensureLoggedIn, recipesCtrl.new);
// // GET /recipes/:id (show functionality) MUST be below new route
// router.get('/:id', recipesCtrl.show);
// POST /recipes
router.post('/', ensureLoggedIn, recipesCtrl.create);
	
module.exports = router;
