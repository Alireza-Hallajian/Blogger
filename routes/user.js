//node_modules
const express = require('express');
const session = require('express-session');
const router = express.Router();
const colors = require('colors');

//models
const User = require('../models/user.js');


//******************************************************************************** */
//                                  Show Dashboard
//******************************************************************************** */

router.get('/dashboard', (req, res) =>
{
    //blogger login
    if (req.session.user.role === "blogger")
    {
        return res.render("dashboard-blogger.ejs", 
        {
            fname: req.session.user.firstName,
            lname: req.session.user.lastName,
            uname: req.session.user.username,
            gender: req.session.user.sex,
            mobile: req.session.user.mobile
        });
    }


    //admin login
    else if (req.session.user.role === "admin")
    {
        return res.render("dashboard-admin.ejs",
        {
            fname: req.session.user.firstName,
            lname: req.session.user.lastName,
            uname: req.session.user.username,
            gender: req.session.user.sex,
            mobile: req.session.user.mobile
        });
    }


    else {
        res.redirect('/signin');
    }
});



//******************************************************************************** */
//                                  Edit Profile
//******************************************************************************** */

//duplicate username' and 'mobile' check
router.post('/edit', async (req, res) => 
{
    try 
    {
        // find user with duplicate 'username'
        const blogger_username = await User.findOne({ 
            username: req.body.username,  
            _id: { $ne: req.session.user._id } 
        });

        // find user with duplicate 'mobile'
        const blogger_mobile = await User.findOne({ 
            mobile: req.body.mobile,  
            _id: { $ne: req.session.user._id  } 
        });


        //both 'username' and 'mobile' conflict
        if (blogger_username && blogger_mobile) {
            return res.status(409).send("Username and Mobile are duplicate to another user(s).");
        }

        //'username' conflict
        else if (blogger_username) {
            return res.status(409).send("Username is duplicate to another user.");
        }

        //'mobile' conflict
        else if (blogger_mobile) {
            return res.status(409).send("Mobile is duplicate to another user.");
        }

        //No conflict
        else {
            return res.send("No Conflict");
        }
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});


router.put('/edit', async (req, res) => 
{
    try
    {
        await User.findByIdAndUpdate(req.session.user._id, 
            {firstName: req.body.fname, lastName: req.body.lname, username: req.body.username, mobile: req.body.mobile, sex: req.body.sex}, 
            {new: true}, 
            (err, user) => {
                if (err) {
                    return console.log(colors.brightRed("\nError in database update:\n" + err));
                }
                console.log(user);
                return res.sendStatus(200);
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
        res.send('/');
    });
});





module.exports = router;