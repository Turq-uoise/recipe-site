const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');
const ensureLoggedIn = require('../config/ensureLoggedIn');

// POST /recipes/:id/comments (create comment for a recipe)
router.post('/recipes/:id/comments', ensureLoggedIn, commentsCtrl.create);
// DELETE /comments
router.delete('/comments/:id', ensureLoggedIn, commentsCtrl.delete);
// Update /comments
router.put('/comments/:id', ensureLoggedIn, commentsCtrl.update);

module.exports = router;