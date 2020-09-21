//node_modules
const express = require('express');
const router = express.Router();

//models
const User = require('../models/user.js');



router.get('/', function (req, res) 
{  
    res.render("dashboard.ejs", 
    {
        fname: req.session.user.firstName,
        lname: req.session.user.lastName,
        uname: req.session.user.username,
        gender: req.session.user.sex,
        mobile: req.session.user.mobile
    });
});



module.exports = router;