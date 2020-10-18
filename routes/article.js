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

router.put('/avatar/:article_id', async (req, res) => 
{
    try
    {
        //************************************************************** */
        //                  Mongo ObjectID Validation
        //************************************************************** */

        //ckeck 'article_id' to be a valid mongo ObjectID
        let article_id_val = VALIDATOR.ObjectID_val(req.params.article_id)

        //invalid 'article_id'
        if (article_id_val !== true) {
            return res.status(400).send(article_id_val);
        }


        //************************************************************** */
        //            chcek 'article_id' to be its own artice  
        //************************************************************** */

        let article_author = await Article.findById(req.params.article_id, (err, article) => {
            if (err) throw err;
        }).populate("author");

        if (article_author.author._id != req.session.user._id) {
            return res.status(403).send("You can NOT change other people's article avatar.")
        }


        //************************************************************** */
        //                  Upload Article Avatar
        //************************************************************** */
        
        const upload = multer_config.Article.single('avatar');

        //replace new avatar
        upload(req, res, async function (err) 
        {  
            if (err)
            {
                //multiple file error (just one file/field is accepted)
                if (err instanceof multer.MulterError && err.message === "Unexpected field") {
                    return res.status(400).send(err.message);
                }

                //if NON-acceptable file recieved
                return res.status(400).send(err);
            }

            
            //if no file recieved
            if (!req.file) {
                return res.status(400).send("Empty field error.");
            }


            // *** article avatar updated ***
            
            // previous article avatar is removed automatically
            // because of duplicate filename and extension

            //no need to update database for new avatar, because new one replaces previous one
            //and no change in its name occures


            return res.sendStatus(200);
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});





module.exports = router;