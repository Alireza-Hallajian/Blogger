//node_modules
const express = require('express');
const session = require('express-session');
const { Store } = require('express-session');
const router = express.Router();

//models
const User = require('../models/user.js');



router.get('/', function (req, res) 
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
    res.render("dashboard-admin.ejs",
    {
        fname: req.session.user.firstName,
        lname: req.session.user.lastName,
        uname: req.session.user.username,
        gender: req.session.user.sex,
        mobile: req.session.user.mobile
    });
});



//destroy user session and clear cookie
router.delete('/', function (req, res) 
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