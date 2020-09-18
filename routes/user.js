//node_modules
const express = require('express');
const router = express.Router();

//models
const User = require('../models/user.js');



router.get('/', async function (req, res) 
{  
    res.render("dashboard-test.ejs");
});



module.exports = router;