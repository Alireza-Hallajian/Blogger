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



router.post('/', (req, res) => {
    console.log(req.body);
    res.end();
});

router.post('/summary', (req, res) => {
    console.log(req.body);
    res.end();
});



module.exports = router;