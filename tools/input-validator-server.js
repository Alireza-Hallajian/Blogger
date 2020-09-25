const VALIDATOR = {
    signin: signin_validator,
    signup: signup_validator
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





module.exports = VALIDATOR;