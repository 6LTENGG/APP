const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// Step 1 - Configuration
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Step 2 - Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive: true});
}

// Step 3 - Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
        cb(null, Date.now() + '-' + safeName); // Unique filename
    }
});

// Step 4 - File filter to allow only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file      
    } else {
        cb(new Error('Only image files are allowed!'), false); // Reject file
    }  
};

// Step 5 - Initialize multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1 * 1024 * 1024 } }); // Limit file size to 1MB

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

router.post('/post_blog', isLogged, upload.single('imageInput'), (req, res) => {
  try {
    // Debug: Log the entire req.body to see what's being received
    console.log('📝 Full req.body:', req.body);
    console.log('📝 req.body type:', typeof req.body);
    console.log('📝 req.body keys:', Object.keys(req.body || {}));
    
    // Check if req.body exists
    if (!req.body) {
      console.error('❌ req.body is undefined');
      return res.status(400).send('Error: Form data not received. req.body is undefined.');
    }
    
    const {title, category, tags, hiddenContent} = req.body; // Changed 'tag' to 'tags'
    
    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).send('Error: Title is required.');
    }
    
    if (!hiddenContent || !hiddenContent.trim()) {
      return res.status(400).send('Error: Content is required.');
    }
    
    const userid = req.session.user.id; // Assuming user ID is stored in session
    const userFullName = req.session.user.first_name + ' ' + req.session.user.last_name;

    console.log('✅ Received blog post data:', { title, category, tags, hiddenContent: hiddenContent.substring(0, 100) + '...', userid, userFullName });
    console.log('📎 Uploaded file:', req.file ? req.file.filename : 'No file uploaded');

    res.status(200).json({
      success: true,
      message: 'Blog post received successfully!',
      data: { title, category, tags, hasContent: !!hiddenContent, hasFile: !!req.file }
    });

  } catch (error) {
    console.error('❌ Error processing blog post:', error);
    res.status(500).send('Internal server error: ' + error.message);
  }
});

module.exports = router;
