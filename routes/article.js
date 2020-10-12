//node_modules
const express = require('express');
const router = express.Router();
const colors = require('colors');

//routers
const user_router = require('./user.js');

//models
const User = require('../models/user.js');
const Article = require('../models/article.js');

//tools
const INPUT_VALIDATOR = require('../tools/input-validator-server.js');
const CHECKER = require('../tools/checker.js');


//******************************************************************************** */
//                                   Authentication
//******************************************************************************** */

// *****************************************************
//                        Check Session
// *****************************************************

//check if user is logged-in to access non-permitted sections for non-registered users
const check_session = function (req, res, next) 
{  
    //for requests wtih method GET
    if (!req.session.user && req.method === "GET") {     
        return res.redirect('/signin');
    }

    //for AJAX requests with methods rather than GET
    else if (!req.session.user) {
        return res.sendStatus(403);
    }

    next();
}


router.post('/', check_session, (req, res) => 
{
    try
    {
        //************************************************************** */
        //                  save new user to data base  
        //************************************************************** */

        const new_article = new User({
            author: req.session.user._id,
            title: req.body.title,
            content: req.body.content,
            summary: req.body.summary
        });

        new_article.save((err) => 
        {
            if (err) return res.status(500).send("Something went wrong! Try again.");

            console.log(`${colors.bgYellow.black('\nNew Article added.')} ` + "\n");
            return res.sendStatus(200);
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
    }
});

router.put('/avatar', (req, res) => {
    console.log("Image Recieved");
    res.end();
});



module.exports = router;