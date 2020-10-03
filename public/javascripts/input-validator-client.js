export const VALIDATOR = {
    signin: signin_validator,
    signup: signup_validator,
    edit: edit_validator,
    p_change: change_password
};


// *********************************************************************************
//                                      Sign-in
// *********************************************************************************

function signin_validator(data) 
{
    // empty field check
    if (!data.username || !data.password) 
    {
        $("#error-alert").html("<b>*All fields</b> Must be filled.");
        $("#error-alert").show();
        $("html").scrollTop(210);
    } else {
        $("#error-alert").hide();
    }

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        $("#uname-length-warning").css("visibility", "visible");
    } else {
        $("#uname-length-warning").css("visibility", "hidden");
    }

    //Password length check
    if (data.password.trim().length < 6 || data.password.trim().length > 12) {
        $("#password-length-warning").css("visibility", "visible");
    } else {
        $("#password-length-warning").css("visibility", "hidden");
    }


    // *****************************************************
    //                     Warning Check
    // *****************************************************


    //data input (pre)-IDs (css ID)
    let input_boxes_arr = ["username", "password"];

    //check if there is any input warning
    for (let i = 0; i < input_boxes_arr.length; i++) 
    {
        if (warning_checker(input_boxes_arr[i]) === true) {
            return false;   //incorrect data input.
        }
    }

    //no errors in data input
    return true;
}



// *********************************************************************************
//                                      Sign-up
// *********************************************************************************

function signup_validator(data) 
{
    // empty field check
    if (!data.fname || !data.lname || !data.username || !data.password || !data.password_repeat || !data.mobile) 
    {
        $("#error-alert").html("<b>*All fields</b> Must be filled.");
        $("#error-alert").show();
        $("html").scrollTop(290);
    } else {
        $("#error-alert").hide();
    }


    $("#user-existence-alert").hide();

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //First Name length check
    if (data.fname.trim().length < 2 || data.fname.trim().length > 15) {
        $("#fname-length-warning").css("visibility", "visible");
    } else {
        $("#fname-length-warning").css("visibility", "hidden");
    }

    //Last Name length check
    if (data.lname.trim().length < 3 || data.lname.trim().length > 20) {
        $("#lname-length-warning").css("visibility", "visible");
    } else {
        $("#lname-length-warning").css("visibility", "hidden");
    }

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        $("#uname-length-warning").css("visibility", "visible");
    } else {
        $("#uname-length-warning").css("visibility", "hidden");
    }

    //Password length check
    if (data.password.length < 6 || data.password.length > 12) {
        $("#password-length-warning").css("visibility", "visible");
    } else {
        $("#password-length-warning").css("visibility", "hidden");
    }

    //Mobile Number length check
    if (data.mobile.trim().length !== 11) {
        $("#mobile-length-warning").css("visibility", "visible");
    } else {
        $("#mobile-length-warning").css("visibility", "hidden");
    }


    // *****************************************************
    //                     Warning Check
    // *****************************************************

    //passwrod repeat check
    if ($("#password-box").val() === "" || $("#password-box").val() !== $("#password-repeat-box").val()){
        $("#password-repeat-warning").css("visibility", "visible");
    } else {
        $("#password-repeat-warning").css("visibility", "hidden");
    }


    //check if there is anything than number in 'Mobile Number' Box
    for (let i = 0; i < data.mobile.length; i++) 
    {
        if (isNaN(Number(data.mobile.charAt(i))) === true) 
        {
            $("#number-validation-warning").css("visibility", "visible");
            return false;   //incorrect data input.
        }

        else {
            $("#number-validation-warning").css("visibility", "hidden");
        }
    }


    //data input (pre)-IDs (css ID)
    let input_boxes_arr = ["firstname", "lastname", "username", "password", "password-repeat", "mobile"];

    //check if there is any input warning
    for (let i = 0; i < input_boxes_arr.length; i++) 
    {
        if (warning_checker(input_boxes_arr[i]) === true) {
            return false;   //incorrect data input.
        }
    }

    //no errors in data input
    return true;
}



// *********************************************************************************
//                                    Edit Profile
// *********************************************************************************

//length and warning check for inputs while editing
function edit_validator(data) 
{
    // empty field check
    if (!data.fname || !data.lname || !data.username || !data.mobile) 
    {
        $("#error-alert").html("<b>*All fields</b> Must be filled.");
        $("#error-alert").show();
        return $("html").scrollTop(290);
    } else {
        $("#error-alert").hide();
    }

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //errors container for showing in error
    let errors_text = "";

    //First Name length check
    if (data.fname.trim().length < 2 || data.fname.trim().length > 15) {
        errors_text += "<br>*First Name must long at least 2 and at last 15";
    }

    //Last Name length check
    if (data.lname.trim().length < 3 || data.lname.trim().length > 20) {
        errors_text += "<br>*Last Name must long at least 3 and at last 20";
    }

    //Username length check
    if (data.username.trim().length < 3 || data.username.trim().length > 10) {
        errors_text += "<br>*Username must long at least 3 and at last 10";
    }

    //Mobile Number length check
    if (data.mobile.length !== 11) {
        errors_text += "<br>*mobile Number Must long 11";
    }


    // *****************************************************
    //                     Warning Check
    // *****************************************************

    //check if there is anything than number in 'Mobile Number' Box
    for (let i = 0; i < data.mobile.trim().length; i++) 
    {
        if (isNaN(Number(data.mobile.charAt(i))) === true) {
            errors_text += "<br>*Only numbers are accepted for mobile number";
        }
    }


    //if there is any error, show it in error box
    if (errors_text !== "") {
        $("#error-alert").show();
        $("html").scrollTop(500);
        return $("#error-alert").html(`<p>${errors_text}</p>`);
    }
    else {
        $("#error-alert").hide();
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
        $("#error-alert-modal").html("<b>*All fields</b> Must be filled.");
        $("#error-alert-modal").show();
    } else {
        $("#error-alert-modal").hide();
    }

    // *****************************************************
    //                     Length Check
    // *****************************************************

    //Old-Password length check
    if (data.old.length < 6 || data.old.length > 12) {
        $("#old-password-length-warning").css("visibility", "visible");
    } else {
        $("#old-password-length-warning").css("visibility", "hidden");
    }

    //New-Password length check
    if (data.new.length < 6 || data.new.length > 12) {
        $("#new-password-length-warning").css("visibility", "visible");
    } else {
        $("#new-password-length-warning").css("visibility", "hidden");
    }


    // *****************************************************
    //                     Warning Check
    // *****************************************************

    //Repeat-Password length check
    if (data.repeat !== data.new) {
        $("#repeat-password-length-warning").css("visibility", "visible");
    } else {
        $("#repeat-password-length-warning").css("visibility", "hidden");
    }


    //data input (pre)-IDs (css ID)
    let input_boxes_arr = ["old-p", "new-p", "repeat-p"];

    //check if there is any input warning
    for (let i = 0; i < input_boxes_arr.length; i++) 
    {
        if (warning_checker(input_boxes_arr[i]) === true) {
            return false;   //incorrect data input.
        }
    }

    //no errors in data input
    return true;
}


// *********************************************************************************
//                                 Minor Operations
// *********************************************************************************

//checks if there is any incorrect data input.
function warning_checker (input_box) 
{  
    if ($(`#${input_box}-box + div`).css("visibility") == "visible") {
        return true;    //incorrect data input.
    }

    else {
        return false;   //no errors in data input
    }
}