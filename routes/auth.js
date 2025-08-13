const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const bcrypt = require('bcrypt');

// Render homepage
router.get('/', (req, res) => {
  res.render('index');
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Render register page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Render post blog page
router.get('/post_blog', (req, res) => {
  res.render('post_blog');
});

// Render read blog page
router.get('/read_blog', (req, res) => {
  res.render('read_blog');
});

// Handle user registration
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).render('register', { error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).render('register', { error: 'Passwords do not match.' });
    }

    // Split fullName into first and last names more robustly
    const nameParts = fullName.trim().split(/\s+/);
    const first_name = nameParts.shift();
    const last_name = nameParts.join(' ') || '';

    // Check if user already exists
    db.query('SELECT * FROM username WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).render('register', { error: 'Internal server error.' });
      }

      if (results.length > 0) {
        return res.status(400).render('register', { error: 'Email already registered.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        'INSERT INTO username (first_name, last_name, email, password, authen) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, 1],
        (err2) => {
          if (err2) {
            console.error('Error inserting user:', err2);
            return res.status(500).render('register', { error: 'Internal server error.' });
          }

          // Registration successful, redirect to login
          res.redirect('/login');
        }
      );
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).render('register', { error: 'Something went wrong.' });
  }
});

module.exports = router;
