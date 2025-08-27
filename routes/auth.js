const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const bcrypt = require('bcrypt');

// Render pages
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null }));
router.get('/post_blog', (req, res) => res.render('post_blog'));
router.get('/read_blog', (req, res) => res.render('read_blog'));

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

      // Insert new user
      db.query(
        'INSERT INTO username (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Insert error:', insertErr);
            return res.status(500).render('register', { error: 'Internal server error.' });
          }

          res.redirect('/login');
        }
      );
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).render('register', { error: 'Internal server error.' });
  }
});

// Handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt with email:', email);

  if (!email || !password) {
    return res.status(400).render('login', { error: 'Email and password are required.' });
  }

  db.query('SELECT * FROM username WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).render('login', { error: 'Internal server error.' });
    }

    if (results.length && await bcrypt.compare(password, results[0].password)) {

      req.session.user = results[0].email;
      console.log('User logged in successfully:', req.session.user);
      res.redirect('/post_blog');
      
    } else {
      console.log('Invalid login for email:', email);
      res.status(401).render('login', { error: 'Invalid email or password.' });
    }
  });
});

module.exports = router;
