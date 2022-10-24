const multer = require('multer');
const uuid = require('uuid');

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars');
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '.jpg');
    }
});

const postImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/posts');
    },
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + '.jpg');
    }
});

const options = {
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg And .jpeg Formats Allowed')
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
};


module.exports.avatarUpload = multer({ storage: avatarStorage, options });
module.exports.postImagesUpload = multer({ storage: postImagesStorage, options });
