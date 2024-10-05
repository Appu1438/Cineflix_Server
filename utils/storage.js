const multer = require('multer');
const path = require('path');
const ffmpeg=require('fluent-ffmpeg')
const { spawn } = require('child_process');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'assets', 'videos')); // Store files in public/videos directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique filenames
    },
});

const upload = multer({ storage });


module.exports = {
    storage,
    upload,
}