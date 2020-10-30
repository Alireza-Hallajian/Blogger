//node_modules
const express = require('express');
const colors = require('colors');

const router = express.Router();

//models
const Article = require('../models/article.js');
const Comment = require('../models/comment.js');

//tools
const VALIDATOR = require('../tools/input-validator-server.js');
const CHECKER = require('../tools/checker.js');



//******************************************************************************** */
//                                  Recieve Comment
//******************************************************************************** */

router.post('/:article_id', async (req, res) =>
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
        //                      find the article
        //************************************************************** */
        
        //check if the article exists
        await Article.findOne({_id: req.params.article_id}, (err, article) => 
        {
            //if database error occured
            if (err) {
                console.log(colors.brightRed("\n" + err + "\n"));
                return res.status(500).send("Something went wrong in finding articles!");
            }

            //if article found
            if (article) 
            {
                //************************************************************** */
                //                      comment length check    
                //************************************************************** */

                //check if correct field recieved
                if (!req.body.comment) {
                    return res.status(400).send("Empty field error!")
                }

                if (req.body.comment.length > 1000) {
                    return res.status(400).send("*Maximum characters allowed is 1000.");
                }


                //************************************************************** */
                //                     save comment in database
                //************************************************************** */

                const new_comment = new Comment({
                    article_id: req.params.article_id,
                    author_id: req.session.user._id,
                    content: req.body.comment
                });

                new_comment.save((err) => 
                {
                    if (err) {
                        console.log(colors.brightRed("\n" + err + "\n"));
                        return res.status(500).send("Something went wrong in saving comment! Try again.");
                    }


                    console.log(`${colors.bgYellow.black('\nNew Comment added.')} ` + "\n");

                    return res.sendStatus(200);
                });

            }

            else {
                return res.status(404).send("Article NOT found");
            }
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});





module.exports = router;