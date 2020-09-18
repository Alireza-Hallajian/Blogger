//node_modules
const express = require('express');
const router = express.Router();
const colors = require('colors');

//models
const User = require('../models/user.js');

//tools
const VALIDATOR = require('../tools/validator.js');



// const checkSession = function (req, res, next) {  
//     if (!req.session.user) return res.redirect('/signin')

//     next();
// }


// const isLogin = function (req, res, next) {  
//     if (req.session.user) { return res.redirect('/user/dashboard'); }
    
//     next();
// }


//******************************************************************************** */
//                                     Sign-in
//******************************************************************************** */

// GET Sign-in page
router.get("/signin", function (req, res) {
    res.render('./signin.ejs');
});


// Sign-in operation
router.post('/signin', async function (req, res) 
{  
    try
    {
        // empty input warning
        if (!req.body.username || !req.body.password) {
            throw ("You have empty input(s)!");
        }

        // find user
        const blogger = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });

        // user not found
        if (!blogger) {
            throw ("User does not exist!")
        }

        // save user info to a session
        req.session.user = blogger;
        console.log(req.session);


        res.redirect('/user/dashboard');
    }

    catch(err) {
        console.log(err);
        res.send(err);
    }
});


//******************************************************************************** */
//                                     Sign-Up
//******************************************************************************** */

// GET Sign-Up page
router.get("/signup", function (req, res) {
    res.render('./signup.ejs');
});


// Sign-up operation
router.post('/signup', async function (req, res) 
{  
    try
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let signup_validation_result = VALIDATOR.signup_input(req.body);
    
        //if sign-up data has any errors
        if (signup_validation_result !== true) {
            return res.send(signup_validation_result);
        }


        //************************************************************** */
        //                  Data Base duplicate data check  
        //************************************************************** */
    
        // user existence check
        const blogger_username = await User.findOne({
            username: req.body.username.trim().toLowerCase()
        });

        if (blogger_username) {
            return res.status(400).send(`${req.body.username} already exists.`);
        }


        //mobile number existence check
        const blogger_mobile = await User.findOne({
            mobile: req.body.mobile.trim().toLowerCase()
        });

        if (blogger_mobile) {
            return res.status(400).send("This mobile number already exists.");
        }


        //************************************************************** */
        //                  save new user to data base  
        //************************************************************** */


        const new_blogger = new User({
            firstName: req.body.fname,
            lastName: req.body.lname,
            username: req.body.username,
            password: req.body.password,
            mobile: req.body.mobile,
            sex: req.body.sex
        });

        new_blogger.save((err) => 
        {
            if (err) return res.status(500).send("Something went wrong! Try again");

            console.log(`${colors.bgYellow.black('\nNew User:')} ` + new_blogger + "\n");
            // res.write("Sign-Up was successful.")
            return res.send("/signin");
        });
    }

    catch(err) {
        console.log(colors.brightRed("\n" + err + "\n"));
    }
});




module.exports = router;