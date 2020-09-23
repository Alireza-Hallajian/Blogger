//node_modules
const express = require('express');
const session = require('express-session');
const { Store } = require('express-session');
const router = express.Router();

//models
const User = require('../models/user.js');



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



//duplicate data check
router.post('/edit', async (req, res) => 
{
    // find user with duplicate 'username'
    const blogger_username = await User.findOne(
        {username: req.body.username},
        { _id: {$ne: req.session.user._id}}
    );

    // find user with duplicate 'mobile'
    const blogger_mobile = await User.findOne({
        mobile: req.body.mobile
    });
});


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