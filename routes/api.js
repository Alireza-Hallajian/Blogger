//node_modules
const express = require('express');
const router = express.Router();
const colors = require('colors');

//routers
const user_router = require('./user.js');

//models
const User = require('../models/user.js');

//tools
const INPUT_VALIDATOR = require('../tools/input-validator-server.js');
const CHECKER = require('../tools/checker.js');



//******************************************************************************** */
//                                   Authentication
//******************************************************************************** */


// *****************************************************
//                     Check Session
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


// *****************************************************
//             accessing login-based sections
// *****************************************************

router.use('/user', check_session , user_router);
// router.use('/article', check_session, user_router);
// router.use('/comment', check_session, user_router);


// *****************************************************
//                        Is Login?
// *****************************************************

//check if user is already logged-in (not to redirect to 'signin' and 'signup' pages)
const is_login = function (req, res, next) 
{  
    //for requests wtih method GET
    if (req.session.user && req.method === "GET") {   
        return res.redirect('/user/dashboard');
    }

    //for AJAX requests with methods rather than GET
    else if (req.session.user) {
        return res.sendStatus(303);
    }
    
    next();
}

//******************************************************************************** */
//                                     Sign-in
//******************************************************************************** */

// GET Sign-in page
router.get("/signin", is_login,  (req, res) => {
    res.render('signin.ejs');
});


// Sign-in operation
router.post('/signin', is_login, async (req, res) =>
{  
    try
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let signin_validation_result = INPUT_VALIDATOR.signin(req.body);
    
        //if sign-in data has any errors
        if (signin_validation_result !== true) {
            return res.send(signin_validation_result);
        }


        //************************************************************** */
        //                          Data Base check  
        //************************************************************** */

        // find user
        const blogger = await User.findOne({username: req.body.username });


        // if user not found
        if (!blogger) {
            return res.status(404).send
                ("User <b>NOT exists</b> or <b>Username/Password</b> is not correct.");
        }

        else 
        {
            // check user's password
            await blogger.compare_password(req.body.password, function(err, is_match) 
            {
                if (err) throw err;
    
                // if password does NOT match
                if (is_match === false) {
                    return res.status(404).send
                        ("User <b>NOT exists</b> or <b>Username/Password</b> is not correct.");
                }


                // user authenticated
                // save user info in a session
                req.session.user = blogger;

                res.send("/user/dashboard");
            });

        }
    }

    catch(err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


//******************************************************************************** */
//                                     Sign-Up
//******************************************************************************** */

// GET Sign-Up page
router.get("/signup", is_login, (req, res) => {
    res.render('signup.ejs');
});


// Sign-up operation
router.post('/signup', is_login, async (req, res) =>
{  
    try
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let signup_validation_result = INPUT_VALIDATOR.signup(req.body);
    
        //if sign-up data has any errors
        if (signup_validation_result !== true) {
            return res.send(signup_validation_result);
        }


        //************************************************************** */
        //                  Data Base duplicate data check  
        //************************************************************** */

        let duplicate_check_result = await CHECKER.duplicate_signup(
            req.body.username.trim().toLowerCase(), 
            req.body.mobile.trim().toLowerCase()
        );

        //if conflict occured
        if (duplicate_check_result !== "No Conflict") {
            return res.status(409).send(`${duplicate_check_result}`);
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
            if (err) return res.status(500).send("Something went wrong! Try again.");

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