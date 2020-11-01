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


//******************************************************************************** */
//                                 Profile Avatar
//******************************************************************************** */

const profile_avatar_storage = multer.diskStorage(
{
    destination: function (req, file, callback) {  
        callback(null, 'public/images/profiles');
    },

    filename: function (req, file, callback) 
    {  
         //all file extensions are assigned to '.jpg' to be replaced with previous image 
        //in case of extension diffrence
        //with this trick, there is no need to remove prev image and overload in the server
        callback(null, req.session.user._id + "_" + req.session.user.username + ".jpg");
    }
});


const upload_profile_avatar = multer(
{
    storage: profile_avatar_storage,

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


//******************************************************************************** */
//                                Article Avatar
//******************************************************************************** */

const article_avatar_storage = multer.diskStorage(
    {
        destination: function (req, file, callback) {  
            callback(null, 'public/images/articles');
        },
    
        filename: function (req, file, callback) 
        {  
             //all file extensions are assigned to '.jpg' to be replaced with previous image 
            //in case of extension diffrence
            //with this trick, there is no need to remove prev image and overload in the server
            callback(null, req.params.article_id + "_" + req.session.user.username + ".jpg");
        }
    });
    
    
    const upload_article_avatar = multer(
    {
        storage: article_avatar_storage,
    
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





const UPLOADER = {
    Profile: upload_profile_avatar,
    Article: upload_article_avatar,
}


module.exports = UPLOADER;