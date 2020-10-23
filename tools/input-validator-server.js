const VALIDATOR = {
    signin: signin_validator,
    signup: signup_validator,
    duplicate: duplicate_validator,
    edit: edit_validator,
    p_change: change_password,
    article: article_characters_count,
    ObjectID_val: mongo_objectID_validator
};


// *********************************************************************************
//                                    Sign-in
// *********************************************************************************

function signin_validator(data) 
{
    // *****************************************************
    //                     Warning Check
    // *****************************************************

    // empty field check
    if (!data.username || !data.password) {
        return ("Empty field error!");
    } 
    
    // *****************************************************
    //                     Length Check
    // *****************************************************

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        return ("*Username length is not valid");
    } 

    //Password length check
    if (data.password.length < 6 || data.password.length > 12) {
        return ("*Password length is not valid");
    } 

    

    //no errors in data input
    return true;
}



// *********************************************************************************
//                                    Sign-up
// *********************************************************************************

function signup_validator(data) 
{
    // *****************************************************
    //                     Warning Check
    // *****************************************************

    // empty field check
    if (!data.fname || !data.lname || !data.username || !data.password || !data.mobile || !data.sex) {
        return ("Empty field error!");
    } 
    

    //check if there is anything than number in 'Mobile Number' Box
    for (let i = 0; i < data.mobile.trim().length; i++) 
    {
        if (isNaN(Number(data.mobile.charAt(i))) === true) {
            return ("*Only numbers are accepted for mobile number");
        }
    }

    //gender check
    if (data.sex !== "Male" && data.sex !== "Female") {
        return ("Gender must be 'male' or 'female'");
    }


    // *****************************************************
    //                     Length Check
    // *****************************************************

    //First Name length check
    if (data.fname.trim().length < 2 || data.fname.trim().length > 15) {
        return ("*First Name must long at least 2 and at last 15");
    } 

    //Last Name length check
    if (data.lname.trim().length < 3 || data.lname.trim().length > 20) {
        return ("*Last Name must long at least 3 and at last 20");
    } 

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        return ("*Username must long at least 3 and at last 10");
    } 

    //Password length check
    if (data.password.length < 6 || data.password.length > 12) {
        return ("*Password must long at least 6 and at last 12");
    } 

    //Mobile Number length check
    if (data.mobile.trim().length !== 11) {
        return ("*Mobile Number Must long 11");
    } 
    

    //no errors in data input
    return true;
}



// *********************************************************************************
//                                    Edit Profile
// *********************************************************************************

//duplicate username' and 'mobile' check
function duplicate_validator (data) 
{  
    // empty field check
    if (!data.username || !data.mobile) {
        return ("Empty field error!");
    }

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        return ("*Username must long at least 3 and at last 10");
    }

    //Mobile Number length check
    if (data.mobile.length !== 11) {
        return ("*mobile Number Must long 11");
    }

    
    //no input error
    return true;
}


//length and warning check for inputs while editing
function edit_validator(data) 
{
    // empty field check
    if (!data.fname || !data.lname || !data.username || !data.mobile) {
        return ("Empty field error!");
    }

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //First Name length check
    if (data.fname.trim().length < 2 || data.fname.trim().length > 15) {
        return ("*First Name must long at least 2 and at last 15");
    }

    //Last Name length check
    if (data.lname.trim().length < 3 || data.lname.trim().length > 20) {
        return ("*Last Name must long at least 3 and at last 20");
    }

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        return ("*Username must long at least 3 and at last 10");
    }

    //Mobile Number length check
    if (data.mobile.length !== 11) {
        return ("*mobile Number Must long 11");
    }


    // *****************************************************
    //                     Warning Check
    // *****************************************************

    let mobile_check_result = warning_checker(data.mobile);

    //check if there is anything than number in 'Mobile Number' Box
    if (mobile_check_result !== true) {
        return mobile_check_result;
    }

    
    //no errors in data input
    return true;
}



// *********************************************************************************
//                                 Change Password
// *********************************************************************************

function change_password(data) 
{
    // empty field check
    if (!data.old || !data.new || !data.repeat) 
    {
        return ("*Empty field error!");
    } 

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //Old-Password length check
    if (data.old.length < 6 || data.old.length > 12) {
        return ("*Length Error!")
    } 

    //New-Password length check
    if (data.new.length < 6 || data.new.length > 12) {
        return ("*Length Error!")
    } 


    // *****************************************************
    //                     Warning Check
    // *****************************************************

    //Repeat-Password length check
    if (data.new !== data.repeat) {
        return ("*Both old and new passwords MUST be the same!")
    } 


    //no errors in data input
    return true;
}



// *********************************************************************************
//                                 Minor Operations
// *********************************************************************************

//check if there is anything than number in 'Mobile Number' Box
function warning_checker (mobile) 
{  
    for (let i = 0, len = mobile.trim().length; i < len; i++) 
    {
        if (isNaN(Number(mobile.charAt(i))) === true) {
            return ("*Only numbers are accepted for mobile number");
        }
    }

    return true;
}


// *********************************************************************************
//                             Article Characters Count
// *********************************************************************************

function article_characters_count(data, part)
{
    if (part === "all")
    {
        //Title length check
        if (data.title.trim().length < 2 || data.title.trim().length > 70) {
            return ("*Title must long at least 2 and at last 70");
        }
    
        //Summary length check
        if (data.summary.trim().length < 100 || data.summary.trim().length > 400) {
            return ("*Summary must long at least 100 and at last 400");
        }
    
        //Content length check
        if (data.content.trim().length < 300 || data.content.trim().length > 15000) {
            return ("*Title must long at least 300 and at last 10000");
        }


        //no errors in data input
        return true;
    }


    else 
    {
        //Title length check
        if (part === "title")
        {
            if (data.trim().length < 2 || data.trim().length > 70) {
                return ("*Title must long at least 2 and at last 70");
            }
        }

        //Summary length check
        else if (part === "summary")
        {
            if (data.trim().length < 100 || data.trim().length > 400) {
                return ("*Summary must long at least 100 and at last 400");
            }
        }

        //Content length check
        else if (part === "content")
        {
            if (data.trim().length < 300 || data.trim().length > 15000) {
                return ("*Title must long at least 300 and at last 10000");
            }
        }


        //no errors in data input
        return true;
    }
}


// *********************************************************************************
//                             Mongo ObjectID Validator
// *********************************************************************************

//node modules
const ObjectID = require('mongoose').Types.ObjectId;


function mongo_objectID_validator(id) 
{  
    //valid Mongo ObjectID
    if (ObjectID.isValid(id) && new ObjectID(id) == id) 
    {
        //typeof(ObjectID(id)) is not equal to typeof((id))
        //so double '=' is used instead of triple
        return true;
    }

    //invalid Mongo ObjectID
    else {
        return ("Invalid article id");
    }
}





module.exports = VALIDATOR;