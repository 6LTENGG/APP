const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

function isLogged(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/blogs', isLogged, (req, res) => {
    res.render('index', { user: req.session.user });

});

router.get('/post_blog', isLogged, (req, res) => {
    res.render('post_blog', { user: req.session.user });
});

module.exports = router;
