//node_modules
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

router.put('/avatar', (req, res) => 
{
    try
    {
        const upload = multer_config.Article.single('avatar');


        //replace new avatar
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

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});



module.exports = router;