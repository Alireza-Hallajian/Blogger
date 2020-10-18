//node modules
const multer = require('multer');
const fs = require('fs');

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

    filename: function (req, file, callback) {  
        callback(null, req.session.user._id + "_" + req.session.user.username + MIME_TYPES[file.mimetype]);
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

//node modules
const ObjectID = require('mongoose').Types.ObjectId;
const formidable = require('formidable');

const form = formidable({ 
    multiples: false, 
    uploadDir: 'public/images/articles',
    keepExtensions: true
});


async function upload_article_avatar(req) 
{  
    let article_id = null;
    let form_data_check_result;
    
    await new Promise(function (resolve, reject) 
    {
        form.on('error', (err) => {
            reject(err);
        });
          
        //rename file
        form.on('fileBegin', (fieldname_of_file, file) => {              
            file.path = `public/images/articles/${Date.now()}_${req.session.article._id}_${req.session.user.username}${MIME_TYPES[file.type]}`;
            req.session.article = {avatar: file.path};
        });
        

        form.parse(req, (err, fields, files) => 
        {
            if (err) reject(err);
            
            
            //number of files and fields
            let files_num = Object.keys(files).length;
            let fields_num = Object.keys(fields).length;

            //id of the article recieved in 'article_id' field
            let id = fields.article_id;
            

            //check number of files and fileds recieved (Just one per)
            if (files_num !== 1 || fields_num !== 1) {
                resolve ("Just 1 file and 1 (another)field is accepted.");
            }
            
            //check keys of the recieved form-data
            else if (!("article_id" in fields) || !("article_avatar" in files)) {
                resolve ("Keys of the recieved form-data are not accepted (or not enough).");
            }


            //if the extension of the file is NOT accepted
            else if (!(files.article_avatar.type in MIME_TYPES)) {  
                resolve ("Only JPEG, JPG or PNG files are allowed");
            }



        //****************************************************************
        //                              BUG
        //****************************************************************
        // (node:18736) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 
        // 11 error listeners added to [IncomingForm]. Use emitter.setMaxListeners() to increase limit

            //check if recieved id is a valid mongo id, do strict validate
            else if (ObjectID.isValid(id)) 
            {
                //valid Mongo ObjectID
                if (new ObjectID(id) == id) 
                {
                    //assign 'article_id' to be returned
                    article_id = fields.article_id;
                    
                    //typeof(ObjectID(id)) is not equal to typeof((id))
                    //so double '=' is used instead of triple
                    resolve (true);
                }
            }

            //invalid Mongo ObjectID
            else {
                resolve ("Invalid article id");
            }
        });
    })
    .then(result => {
        form_data_check_result = result;
    });


    return {
        article_id,
        result: form_data_check_result
    }
}





const UPLOADER = {
    Profile: upload_profile_avatar,
    Article: upload_article_avatar,
}


module.exports = UPLOADER;