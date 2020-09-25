const CHECKER = {
    duplicate: duplicate_validator
};

//models
const User = require('../models/user.js');


//******************************************************************************** */
//                      duplicate username' and 'mobile' check
//******************************************************************************** */

async function duplicate_validator (username, mobile, session)
{
    // find user with duplicate 'username'
    const blogger_username = await User.findOne({ 
        username: username,  
        _id: { $ne: session._id } 
    });

    // find user with duplicate 'mobile'
    const blogger_mobile = await User.findOne({ 
        mobile: mobile,  
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





module.exports = CHECKER;