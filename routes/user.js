//node_modules
const express = require('express');
const colors = require('colors');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

//models
const User = require('../models/user.js');

//tools
const INPUT_VALIDATOR = require('../tools/input-validator-server.js');
const multer_config = require('../tools/multer-config.js');
const CHECKER = require('../tools/checker.js');



//******************************************************************************** */
//                                  Show Dashboard
//******************************************************************************** */

//redirect to 'dashboard' if '/user' requested
router.get('/', (req, res) => {
    res.redirect('/user/dashboard');
});


router.get('/dashboard', (req, res) =>
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

router.post('/edit', async (req, res) => 
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

router.put('/edit', async (req, res) => 
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


//******************************************************************************** */
//                                  Change Avatar
//******************************************************************************** */

router.put('/avatar', (req, res) =>
{
    try
    {
        const upload = multer_config.Profile.single('avatar');


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


            // *** user avatar updated ***
            
            // previous user avatar is removed automatically
            // because of duplicate filename and extension

            //no need to update database for new avatar, because new one replaces previous one
            //and no change in its name occures


            //update user's session for new avatar (needed when user reloads dashboard)
            req.session.user.avatar = req.file.filename;

            return res.sendStatus(200);
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


//******************************************************************************** */
//                                  Remove Avatar
//******************************************************************************** */

router.delete('/avatar', (req, res, next) =>
{
    //if user's avatar is NOT default
    if (req.session.user.avatar !== "default-profile-pic.jpg") 
    {
        //remove user's avatar
        fs.unlink(`public/images/profiles/${req.session.user.avatar}`, function (err) 
        {
            if (err) {
                console.log(colors.brightRed("\n" + `Something went wrong in removing " ${req.session.user.username} " avatar!` + "\n"));
                console.log(colors.brightRed(err + "\n\n"));

                return res.status(500).send("Something went wrong in removing photo!");
            }


            //update user's avatar in database (change to default)
            User.findByIdAndUpdate(req.session.user._id, { avatar: "default-profile-pic.jpg" }, (err, user) => 
            {
                //if database error encountered
                if (err) {
                    console.log(colors.brightRed("\n" + err + "\n"));

                    return res.status(500).send("Something went wrong in updating or finding the user!");
                }


                //change user's avatar to default
                req.session.user.avatar = "default-profile-pic.jpg";

                return res.send("User' avatar removed sucessfully");
            });
        });
    }


    //if user's avatar is default
    else {
        return res.status(400).send("Default avatar can Not be removed.");
    }
});


//******************************************************************************** */
//                                 Change Password
//******************************************************************************** */

router.put('/password', async (req, res) => 
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