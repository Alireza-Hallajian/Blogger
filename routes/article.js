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
const upload_config = require('../tools/upload-config.js');
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
        //                    upload article avatar
        //************************************************************** */

        let upload_article_avatar = await upload_config.Article(req).catch(err => { throw err; });


        //if recieved from-data is not acceptable
        if (upload_article_avatar.result !== true) 
        {       
            //remove new photo if recieved from-data has any non-acceptable part
            //('formidable' module, uploads file when '.parse' method is called --> refer to 'upload-config' file)
            fs.unlink(req.session.article.avatar, function (err) 
            {
                if (err) {
                    console.log(colors.bgRed("\n" + `Something went wrong in removing " ${req.session.user.username}'s " new article avatar!` + "\n"));
                    console.log(colors.brightRed(err + "\n"));
                }
            });            


            //change article avatar to default in database, because previous one has been deleted in upper code block
            await Article.findByIdAndUpdate(upload_article_avatar.article_id, {articleAvatar: "default-article-pic.png"}, (err, article) => 
            {
                if (err) 
                {
                    console.log(colors.bgRed("\n" + `Something went wrong in changing previous " ${article.title}'s " avatar to default!` + "\n"));
                    console.log(colors.brightRed(err + "\n"));
    
                    return res.status(500).send("Something went wrong in finding article!");
                }
            });

            
            return res.status(400).send(upload_article_avatar.result);
        }
            
        
            // //update articles's avatar in database
            // await Article.findByIdAndUpdate(upload_article_avatar.article_id, {articleAvatar: req.session.article.avatar}, {new: false}, (err, article) => 
            // {
            //     if (err) 
            //     {
            //         //remove new photo if could not save in database
            //         fs.unlink(`public/images/articles/${req.file.filename}`, function (err) {
            //             if (err) {
            //                 console.log(colors.bgRed("\n" + `Something went wrong in removing new " ${article.title}'s " avatar!` + "\n"));
            //                 console.log(colors.brightRed(err + "\n"));
            //             }
            //         });

            //         return res.status(500).send("Something went wrong in finding article!");
            //     }


            //     //previous article avatar is removed automatically
            //     //because of duplicate filename

                
            //     // article avatar updated
            //     return res.sendStatus(200);
            // });

            return res.sendStatus(200);
        
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});





module.exports = router;