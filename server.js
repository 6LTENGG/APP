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
app.use('/', require('./routes/blogs')); // Import and use the blog routes

// Start the server with error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Access your blog at: http://localhost:${PORT}/post_blog`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${PORT} is already in use!`);
        console.log(`💡 Try running: taskkill /PID $(netstat -ano | findstr :${PORT} | awk '{print $5}') /F`);
        console.log(`💡 Or change the PORT in your .env file`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});