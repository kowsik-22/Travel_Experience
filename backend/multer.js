const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, 'uploads/'); //  destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // file name with timestamp
    },
});

// file filter to allow only image files
const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')) {
        cb(null, true); // accept the file
    }
    else{
        cb(new Error('Please upload an image.'), false); // reject the file
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;