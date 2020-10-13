const CHECKER = {
    duplicate_signup: duplicate_signup_validator,
    duplicate_edit: duplicate_edit_validator,
    duplicate_title: duplicate_title_validator
};

//models
const User = require('../models/user.js');
const Article = require('../models/article.js');


//******************************************************************************** */
//              duplicate 'username' and 'mobile' check - Sign-up
//******************************************************************************** */

async function duplicate_signup_validator (username, mobile)
{
    // user existence check
    const blogger_username = await User.findOne({username});

    if (blogger_username) {
        return (`${username} already exists.`);
    }


    //mobile number existence check
    const blogger_mobile = await User.findOne({mobile});

    if (blogger_mobile) {
        return ("This mobile number already exists.");
    }


    //No conflict
    else {
        return ("No Conflict");
    }
}



//******************************************************************************** */
//              duplicate 'username' and 'mobile' check - Editing Profile
//******************************************************************************** */

async function duplicate_edit_validator (username, mobile, session)
{
    // find user with duplicate 'username'
    const blogger_username = await User.findOne({ 
        username,  
        _id: { $ne: session._id } 
    });

    // find user with duplicate 'mobile'
    const blogger_mobile = await User.findOne({ 
        mobile,  
        _id: { $ne: session._id  } 
    });


    //both 'username' and 'mobile' conflict
    if (blogger_username && blogger_mobile) {
        return ("Username and Mobile are duplicate to another user(s).");
    }

    //'username' conflict
    else if (blogger_username) {
        return ("Username is duplicate to another user.");
    }

    //'mobile' conflict
    else if (blogger_mobile) {
        return ("Mobile is duplicate to another user.");
    }

    //No conflict
    else {
        return ("No Conflict");
    }
}



//******************************************************************************** */
//                      duplicate 'title'  - Adding Article
//******************************************************************************** */

async function duplicate_title_validator (title)
{
    // find article with duplicate 'title'
    const article_title = await Article.findOne({ title });


    //'title' conflict
    if (article_title) {
        return ("Title is duplicate to another article.");
    }

    //No conflict
    else {
        return ("No Conflict");
    }
}





module.exports = CHECKER;