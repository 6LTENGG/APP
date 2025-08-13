const express = require('express');
const session = require('express-session');
const db = require('./db'); // Import the database connection
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'MySecretMyChoiceMyself',
    resave: false,
    saveUninitialized: true,
}));

// Routes
// app.get('/', (req, res) => {
//     res.render('index'); 
// });

// app.get('/login', (req, res) => {
//     res.render('login'); 
// });

// Route for authentication
app.use('/', require('./routes/auth')); // Import and use the auth routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});