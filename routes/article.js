//node_modules
const formidable = require('formidable');
const express = require('express');
const colors = require('colors');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

//models
const Article = require('../models/article.js');

//tools
const INPUT_VALIDATOR = require('../tools/input-validator-server.js');
const multer_config = require('../tools/multer-config.js');
const CHECKER = require('../tools/checker.js');
const VALIDATOR = require('../tools/input-validator-server.js');



//******************************************************************************** */
//                                  Save Article
//******************************************************************************** */

router.post('/', async (req, res) => 
{
    try
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let char_cout_validation_result = INPUT_VALIDATOR.article(req.body);
    
        //if characters count have any errors
        if (char_cout_validation_result !== true) {
            return res.send(char_cout_validation_result);
        }


        //************************************************************** */
        //                     duplicate 'title' check    
        //************************************************************** */

        let duplicate_title_result = await CHECKER.duplicate_title(req.body.title);
        
        if (duplicate_title_result !== "No Conflict") {
            return res.status(409).send(`${duplicate_title_result}`);
        }


        //************************************************************** */
        //                  save new article to database  
        //************************************************************** */

        const new_article = new Article({
            author: req.session.user._id,
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary
        });

        new_article.save((err) => 
        {
            if (err) {
                console.log(colors.brightRed("\n" + err + "\n"));
                return res.status(500).send("Something went wrong in saving article! Try again.");
            }

            console.log(`${colors.bgYellow.black('\nNew Article added.')} ` + "\n");
            return res.sendStatus(200);
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


//******************************************************************************** */
//                                  Change Avatar
//******************************************************************************** */

router.put('/avatar', async (req, res) => 
{
    try
    {
        //************************************************************** */
        //                    recieved form-data validation
        //************************************************************** */

        let result = await VALIDATOR.ObjectID(req);
        console.log(result);

        if (result !== true) {
            return res.status(400).send(result);
        }

        // const form = formidable();

        // let form_data_error = "";


        // form.parse(req, (err, fields, files) => 
        // {
        //     if (err) throw err;

        //     let files_num = Object.keys(files).length;
        //     let fields_num = Object.keys(fields).length;
            

        //     //check number of files and fileds recieved (Just one per)
        //     if (files_num !== 1 || fields_num !== 1) {
        //         form_data_error = "Just 1 file and 1 (another)field is accepted.";
        //     }

        //     //check keys of the recieved form-data
        //     if (!("article_id" in fields) || !("article_avatar" in files)) {
        //         form_data_error = "Keys of the recieved form-data are not accepted.";
        //     }


        //     //check 'article_id' to be a valid mongo ObjectID
        //     if (INPUT_VALIDATOR.ObjectID(fields.article_id) === false) {
        //         console.log(colors.brightRed("\n" + `" ${fields.article_id} " is not a valid mongo ObjectID.`) + "\n");
        //         form_data_error = "Invalid article id";
        //     }
        // });


        // //if there is any form-data error
        // if (form_data_error !== "") {
        //     return res.status(400).send(form_data_error);
        // }

        //************************************************************** */
        //             upload article avatar and save to database
        //************************************************************** */

        // else 
        // {
            const upload = multer_config.Article.single('article_avatar');
     
            //upload new avatar
            upload(req, res, async function (err) 
            {  
                if (err)
                {
                    //multiple file error (just one file/field is accepted)
                    if (err instanceof multer.MulterError && err.message === "Unexpected field") {
                        return res.status(400).send("Only one field/file is accepted.");
                    }
    
                    //if NON-acceptable file recieved
                    return res.status(400).send(err);
                }
    
    
                //update articles's avatar
                await Article.findByIdAndUpdate(req.body.article_id, {articleAvatar: req.file.filename}, {new: false}, (err, article) => 
                {
                    if (err) 
                    {
                        //remove new photo if could not save in database
                        fs.unlink(`public/images/articles/${req.file.filename}`, function (err) {
                            if (err) {
                                console.log(colors.bgRed("\n" + `Something went wrong in removing new " ${article.title}'s " avatar!` + "\n"));
                                console.log(colors.brightRed(err + "\n"));
                            }
                        });
    
                        return res.status(500).send("Something went wrong in finding article!");
                    }
    
    
                    //previous article avatar is removed automatically
                    //because of duplicate filename
    
                    
                    // article avatar updated
                    return res.sendStatus(200);
                });
            });
        }
    // }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});





module.exports = router;