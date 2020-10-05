//node modules
const multer = require('multer');


//MIME_TYPES
const MIME_TYPES = {
  'image/jpg': '.jpg',
  'image/jpeg': '.jpg',
  'image/png': '.png'
};

let d = new Date();

// d.toLocaleString().split("/").join(".").split(",").join("_").split(" ").join("").split(":").join(".")  
        // + "_" + req.session.user.username + MIME_TYPES[file.mimetype]

const storage = multer.diskStorage(
{
    destination: function (req, file, cb) {  
        cb(null, 'public/images/profiles');
    },

    filename: function (req, file, cb) {  
        cb(null, Date.now() + "_" + req.session.user.username + MIME_TYPES[file.mimetype]);
    }
});

const upload_avatar = multer({storage: storage});





module.exports = upload_avatar;