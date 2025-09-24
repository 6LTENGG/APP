const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306 // Default MySQL port
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to the MySQL database:', err.message);
        console.log('💡 Make sure MySQL is running and check your .env file credentials');
        // Don't exit process, let the app continue but log the error
        return;
    }
    console.log('✅ Connected to the MySQL database.');
});

// Handle database connection errors
db.on('error', (err) => {
    console.error('❌ Database connection error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 Database connection was closed. Attempting to reconnect...');
        // The connection is automatically handled by mysql2
    } else {
        console.error('Database error:', err);
    }
});

module.exports = db;