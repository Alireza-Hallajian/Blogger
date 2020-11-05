//node_modules
const express = require('express');
const router = express.Router();
const colors = require('colors');

//routers
const user_router = require('./user.js');
const article_router = require('./article.js');
const comment_router = require('./comment.js');

//models
const User = require('../models/user.js');
const Article = require('../models/article.js');
const Comment = require('../models/comment.js');

//tools
const INPUT_VALIDATOR = require('../tools/input-validator-server.js');
const VALIDATOR = require('../tools/input-validator-server.js');
const TOOLS = require('../tools/general-tools.js');
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
router.use('/article', check_session, article_router);
router.use('/comment', check_session, comment_router);


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
//                                 Show All Articles
//******************************************************************************** */

router.get('/', async (req, res) => 
{
    try
    {
        //find all articles sorted by 'createdAt' descended
        await Article.find({}).sort({createdAt: -1}).populate("author").exec((err, articles) => 
        {
            //if database error occured
            if (err) {
                console.log(colors.brightRed("\n" + err + "\n"));
                return res.status(500).send("Something went wrong in finding articles!");
            }


            //define role for ejs file to render correct sidebar
            let role;
            if (req.session.user) {
                role = req.session.user.role;
            }
            else {
                role = "guest"
            }


            //if no article found
            if (articles.length === 0) 
            {
                return res.render("user-articles.ejs", {
                    role,
                    status: "no-Article",
                    message: "There is no such article!"
                });
            }

            //article(s) found
            else 
            {
                let authors_info = [];
                let articles_info = [];
                
                //put all articles inside an array (with needed info)
                for (let i = 0, len = articles.length; i < len; i++)
                {
                    authors_info[i] = {
                        fname: articles[i].author.firstName,
                        lname: articles[i].author.lastName,
                        avatar: articles[i].author.avatar
                    }

                    articles_info[i] = {
                        id: articles[i]._id,
                        createdAt: articles[i].createdAt,
                        avatar: articles[i].articleAvatar,
                        title: articles[i].title,
                        summary: articles[i].summary
                    }
                }

                //send NEEDED-author_info and articles to the client
                return res.render("user-articles.ejs", {
                    role,
                    authors_info,
                    articles_info,
                    status: "has-Article",
                    articles_for: "all",
                    date_format: TOOLS.format_date
                });
            }
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});



//******************************************************************************** */
//                              Show a Specific Article
//******************************************************************************** */

router.get('/article_id/:article_id', async (req, res) => 
{
    try
    {
        //************************************************************** */
        //                  Mongo ObjectID Validation
        //************************************************************** */

        //ckeck 'article_id' to be a valid mongo ObjectID
        let article_id_val = VALIDATOR.ObjectID_val(req.params.article_id)

        //invalid 'article_id'
        if (article_id_val !== true) {
            return res.status(400).send(article_id_val);
        }

        //************************************************************** */
        //                  find the article and its info
        //************************************************************** */        

        await Article.findOne({_id: req.params.article_id}).populate("author").exec(async (err, article) => 
        {
            //if database error occured
            if (err) {
                console.log(colors.brightRed("\n" + err + "\n"));
                return res.status(500).send("Something went wrong in finding the article!");
            }


            //if article not found
            if (!article) 
            {
                return res.render("user-articles.ejs", {
                    role: req.session.user.role,
                    status: "no-Article",
                    message: "There is no such article!"
                });
            }

            //article found
            else 
            {
                //find comments of this article
                await Comment.find({article_id: req.params.article_id}).sort({createdAt: -1}).populate("author_id").exec((err, comments) =>
                {
                    //if database error occured
                    if (err) {
                        console.log(colors.brightRed("\n" + err + "\n"));
                        return res.status(500).send("Something went wrong in finding comments!");
                    }
                    

                    let comments_info = [];

                    //put all comments inside an array (with needed info)
                    for (let i = 0, len = comments.length; i < len; i++)
                    {
                        comments_info[i] = {
                            id: comments[i]._id,
                            createdAt: comments[i].createdAt,
                            content: comments[i].content,
                            

                            author_id: comments[i].author_id.id,
                            author_fname: comments[i].author_id.firstName,
                            author_lname: comments[i].author_id.lastName,
                            author_avatar: comments[i].author_id.avatar
                        };
                    }


                    let authors_info = {
                        fname: article.author.firstName,
                        lname: article.author.lastName,
                        avatar: article.author.avatar
                    }
               
                    let articles_info = {
                        id: article._id,
                        createdAt: article.createdAt,
                        avatar: article.articleAvatar,
                        title: article.title,
                        content: article.content
                    }
                    

                    //define 'role' for ejs file to render correct sidebar
                    //define 'user_id' for ejs file to render correct buttons
                    let role, user_id;

                    if (req.session.user) {
                        role = req.session.user.role;
                        user_id = req.session.user._id;
                    }
                    else {
                        role = "guest",
                        user_id = null;
                    }

    
                    //send NEEDED-author_info and articles to the client
                    return res.render("user-articles.ejs", {
                        role,
                        user_id,
                        status: "show-Article",
                        authors_info,
                        articles_info,
                        comments_info,
                        date_format: TOOLS.format_date
                    });
                });
            }
        });
    }


    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
        res.status(500).send("Something went wrong! Try again.");
    }
});



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

            // res.write("Sign-Up was successful.")
            return res.send("/signin");
        });
    }

    catch (err) {
        console.log(colors.brightRed("\n" + err + "\n"));
    }
});





module.exports = router;