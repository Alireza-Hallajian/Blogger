//node modules
const multer = require('multer');


//MIME_TYPES
const MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png'
};

let d = new Date();

// d.toLocaleString().split("/").join(".").split(",").join("_").split(" ").join("").split(":").join(".")  
        // + "_" + req.session.user.username + MIME_TYPES[file.mimetype]

const storage = multer.diskStorage(
{
    destination: function (req, file, callback) {  
        callback(null, 'public/images/profiles');
    },

    filename: function (req, file, callback) {  
        callback(null, Date.now() + "_" + req.session.user.username + MIME_TYPES[file.mimetype]);
    }
});


const upload_avatar = multer({
    storage: storage,

    fileFilter: function (req, file, callback) 
    {     
        //if no error
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
            return callback(null, true);
        }
           
        //if the extension of the file is NOT accepted
        return callback("Only JPEG, JPG or PNG files are allowed");
    }
});





module.exports = upload_avatar;