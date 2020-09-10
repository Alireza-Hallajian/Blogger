//node_modules
const express = require('express');
const router = express.Router();

//models
const User = require('../models/user.js');




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
router.get("/signin", function (req, res) 
{
    res.render('./signin.ejs', {
        message: 'Please insert your information to signin.'
    })
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
router.get("/signup", function (req, res) 
{
    res.render('./signup.ejs', {
        message: 'Please insert your information to signup.'
    })
});


// Sign-up operation
router.post('/signup', async function (req, res) 
{  
    try
    {
        //************************************************************** */
        //                          input check
        //************************************************************** */

        // empty input check
        if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.sex || !req.body.mobile) {
            throw ("You have empty input(s).")
        };

        // firstName length check
        if (req.body.firstName.length < 2 || req.body.firstName.length > 15) {
            throw ("firstName length is not proper.");
        };

        // lastName length check
        if (req.body.lastName.length < 3 || req.body.lastName.length > 20) {
            throw ("lastName length is not proper.");
        };

        // username length check
        if (req.body.username.length < 3 || req.body.username.length > 10) {
            throw ("username length is not proper.");
        };

        // password length check
        if (req.body.password.length < 6 || req.body.password.length > 12) {
            throw ("Password length is not proper.");
        };

        // mobile length check
        if (req.body.mobile.length < 11 || req.body.mobile.length > 11) {
            throw ("mobile length is not proper.");
        };


        let sexEnum = ["male", "female"];
        // sex-enum check
        if (sexEnum.includes(req.body.sex) === false) {
            throw ("Sex is not accepted");
        }

        //************************************************************** */
        //                          
        //************************************************************** */

        
        // user existence check
        const blogger = await User.findOne({
            username: req.body.username.trim().toLowerCase()
        });

        if (blogger) {
            throw (`${req.body.username} already exists.`);
        }


        // create the user and save to DB
        await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            sex: req.body.sex,
            mobile: req.body.mobile
        
        }, (err, user) => {
            if (err) console.log(err);;
            console.log(user);
        });


        res.send("Sign-Up successful.")
    }

    catch(err) {
        console.log(err);
        res.send(err);
    }
});




module.exports = router;