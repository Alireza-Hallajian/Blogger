//node_modules
const express = require('express');
const router = express.Router();
const colors = require('colors');

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


            // //update articles's avatar
            // await User.findByIdAndUpdate(req.session.user._id, {avatar: req.file.filename}, {new: false}, (err, user) => 
            // {
            //     if (err) 
            //     {
            //         //remove new photo if could not save in database
            //         fs.unlink(`public/images/profiles/${req.file.filename}`, function (err) {
            //             if (err) {
            //                 console.log(colors.bgRed("\n" + `Something went wrong in removing new ${req.session.user.username}'s avatar!` + "\n"));
            //                 console.log(colors.brightRed(err + "\n"));
            //             }
            //         });

            //         return res.status(500).send("Something went wrong in finding user!");
            //     }


            //     //remove previous avatar if is not default
            //     if (req.session.user.avatar !== "default-profile-pic.jpg") 
            //     {
            //         fs.unlink(`public/images/profiles/${user.avatar}`, function (err) {
            //             if (err) {
            //                 console.log(colors.brightRed("\n" + `Something went wrong in removing privious " ${req.session.user.username} " avatar!` + "\n"));
            //                 console.log(colors.brightRed(err + "\n\n"));
            //             }
            //         });
            //     }       

            //     //update user's session for new avatar
            //     req.session.user.avatar = req.file.filename;

                // user avatar updated
                return res.sendStatus(200);
            // });
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});



module.exports = router;