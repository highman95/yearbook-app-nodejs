const multer = require('multer');

const storage = multer.diskStorage({
    // destination: (req, file, cb) => cb(null, 'public/images'),
    filename: (req, file, cb) => {
        cb(null, `capstone-${file.fieldname}-${Date.now()}.gif`);
    },
});

const fileFilter = (req, file, cb) => {
    const isProper = (file.mimetype === 'image/jpeg') || (file.mimetype === 'image/png');
    cb(isProper ? null : new TypeError('Only JPEG/PNG images are acceptable'), isGif);
};

const multerConfig = multer({ storage, fileFilter, limits: { fileSize: 1000000 } }).single('photo');

module.exports = multerConfig;
