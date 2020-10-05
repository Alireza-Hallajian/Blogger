//node_modules
const express = require('express');
const session = require('express-session');
const router = express.Router();
const colors = require('colors');
const fs = require('fs');

//models
const User = require('../models/user.js');

//tools
const INPUT_VALIDATOR = require('../tools/input-validator-server.js');
const CHECKER = require('../tools/checker.js');
const multer_config = require('../tools/multer-config.js')


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


//******************************************************************************** */
//                                  Show Dashboard
//******************************************************************************** */

//redirect to 'dashboard' if '/user' requested
router.get('/', (req, res) => {
    res.redirect('/user/dashboard');
});


router.get('/dashboard', check_session, (req, res) =>
{
    //user dashboard
    if (req.session.user)
    {
        return res.render("dashboard.ejs", 
        {
            fname: req.session.user.firstName,
            lname: req.session.user.lastName,
            uname: req.session.user.username,
            gender: req.session.user.sex,
            mobile: req.session.user.mobile,
            role: req.session.user.role,
            avatar: req.session.user.avatar
        });
    }

    else {
        res.redirect('/signin');
    }
});



//******************************************************************************** */
//                                  Edit Profile
//******************************************************************************** */


//************************************************************** */
//             duplicate username' and 'mobile' check  
//************************************************************** */

router.post('/edit', check_session, async (req, res) => 
{
    try 
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let duplicate_validation_result = INPUT_VALIDATOR.duplicate(req.body);
    
        //if sign-in data has any errors
        if (duplicate_validation_result !== true) {
            return res.send(duplicate_validation_result);
        }

        //************************************************************** */
        //                         Data Base Check  
        //************************************************************** */

        let duplicate_check_result = await CHECKER.duplicate_edit(
            req.body.username, req.body.mobile, req.session.user);
        
        if (duplicate_check_result === "No Conflict") {
            return res.send("No Conflict");
        }

        else {
            return res.status(409).send(`${duplicate_check_result}`);
        }
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});



//************************************************************** */
//                        update profile
//************************************************************** */

router.put('/edit', check_session, async (req, res) => 
{
    try
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let edit_validation_result = INPUT_VALIDATOR.edit(req.body);
    
        //if sign-in data has any errors
        if (edit_validation_result !== true) {
            return res.send(edit_validation_result);
        }


        //************************************************************** */
        //              duplicate 'username' and 'mobile' check    
        //************************************************************** */

        let duplicate_check_result = await CHECKER.duplicate_edit(
            req.body.username, req.body.mobile, req.session.user);
        
        if (duplicate_check_result !== "No Conflict") {
            return res.status(409).send(`${duplicate_check_result}`);
        }


        //************************************************************** */
        //                         Data Base Update  
        //************************************************************** */

        await User.findByIdAndUpdate(req.session.user._id, 
            {firstName: req.body.fname, lastName: req.body.lname, username: req.body.username, mobile: req.body.mobile, sex: req.body.sex}, 
            {new: true}, 
            (err, user) => {
                if (err) {
                    return console.log(colors.brightRed("\nError in database update:\n" + err));
                }
                return res.sendStatus(200);
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


//************************************************************** */
//                        update avatar
//************************************************************** */

router.put('/avatar', check_session, (req, res) =>
{
    try
    {
        const upload = multer_config.single('avatar');


        //replace new avatar
        upload(req, res, async function (err) 
        {  
            if (err) throw err;

            //update user's avatar
            await User.findByIdAndUpdate(req.session.user._id, {avatar: req.file.filename}, {new: false}, (err, user) => 
            {
                if (err) 
                {
                    //remove new photo if could not save in database
                    fs.unlink(`public/images/profiles/${req.file.filename}`, function (err) {
                        if (err) {
                            console.log(colors.brightRed("\n" + `Something went wrong in removing new ${req.session.user.username}'s avatar!` + "\n"));
                            console.log(colors.brightRed(err + "\n"));
                        }
                    });

                    return res.status(500).send("Something went wrong in finding user! Try again.");
                }


                //remove previous avatar if is not default
                if (req.session.user.avatar !== "default-pic.jpg") 
                {
                    fs.unlink(`public/images/profiles/${user.avatar}`, function (err) {
                        if (err) {
                            console.log(colors.brightRed("\n" + `Something went wrong in removing privious ${req.session.user.username}'s avatar!` + "\n"));
                            console.log(colors.brightRed(err + "\n"));
                        }
                    });
                }       

                //update user's session for new avatar
                req.session.user.avatar = req.file.filename;

                return res.sendStatus(200);
            });
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


//************************************************************** */
//                       change password 
//************************************************************** */

router.put('/password', check_session, async (req, res) => 
{
    try
    {
        //************************************************************** */
        //                        Input Validation     
        //************************************************************** */

        //result of input-validation --> 'true' if there is no error
        let edit_validation_result = INPUT_VALIDATOR.p_change(req.body);
    
        //if sign-in data has any errors
        if (edit_validation_result !== true) {
            return res.send(edit_validation_result);
        }


        //************************************************************** */
        //                           Data Base  
        //************************************************************** */

        //find user
        const blogger = await User.findById(req.session.user._id, (err, user) => {
            if (err) throw err;
        });

        //if user not found or be deleted
        if (!blogger) {
            return res.status(404).send("User not found.");
        }


        // check user's previous password
        await blogger.compare_password(req.body.old, function(err, is_match) 
        {
            if (err) throw err;


            // if password matches
            if (is_match === true) 
            {
                //change user's password
                blogger.password = req.body.new;

                //save to database
                blogger.save((err) => {
                    if (err) return res.status(500).send("Something went wrong! Try again.");

                    return res.send("Password Changed.");
                });
            }

            // if password does NOT match
            else {
                return res.status(404).send("Password is not correct.");
            }
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


//******************************************************************************** */
//                                      Log Out
//******************************************************************************** */

//destroy user session and clear cookie
router.delete('/', (req, res) =>
{  
    req.session.destroy((err) => 
    {
        if (err) {
            console.log("\nSession destroy failed:\n" + err + "\n");
            return res.sendStatus(500);
        }

        res.clearCookie("user_sid");
        res.send('/signin');
    });
});





module.exports = router;