export const VALIDATOR = {
    signin: signin_validator,
    signup: signup_validator,
    profile_edit: profile_edit_validator,
    password_change: change_password,
    avatar_change: change_avatar,
    edit_article
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
function profile_edit_validator(data) 
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
        $("#error-alert-password").html("<b>*All fields</b> Must be filled.");
        $("#error-alert-password").show();
        return false;
    } else {
        $("#error-alert-password").hide();
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

    //Repeat-Password length check
    if (data.old === data.new) {
        $("#error-alert-password").html("*New password can NOT be the same as old one.");
        $("#error-alert-password").show();
        return false;
    } else {
        $("#error-alert-password").hide();
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
//                           warning_checker' Function
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


// *********************************************************************************
//                                   Add Avatar
// *********************************************************************************

//FileReader API
let reader = new FileReader();

//show image preview when loaded (FileReader API)
reader.onload = function(event) {
    $("#preview, #preview-article-photo").attr("src", event.target.result);
    $("#preview").css("display", "block");  // (profile photo)
}


//preview selected image (and default image in article avatar)
$("#file-input").on("change", function () 
{   
    //hide error box
    $("#error-alert-photo").hide()


    //if a file selected
    if (this.files[0]) 
    {  
        //show 'Finish' button when a photo is selected - (Article Photo)
        $("#finish-btn").show();

        //hide 'No photo' phrase from preview box - (Profile Photo)
        $("#preview-container p").css("display", "none");


        //read the file(photo) for fetching information (like file path)
        reader.readAsDataURL(this.files[0]); // convert to base64 string
    }

    //if photo deselected
    else 
    {
        //remove preview image if deselected
        $("#preview").attr("src", "").css("display", "none");

        //show 'No photo' phrase in preview box
        $("#preview-container p").css("display", "block");
                
    }
});


//clear preview-image when close button clicked and close the panel
$(".photo-close-btns").on("click", function () 
{  
    //diselect chosen photo
    document.getElementById("file-input-container").reset()

    //remove preview
    $('#preview').attr('src', "");
    $('#preview').css('display', "none");

    //hide alert box
    $("#error-alert-photo").hide();

    //show 'No photo' phrase in preview box
    $("#preview-container p").css("display", "block");
});


function change_avatar() 
{  
    //file-input
    let file = document.getElementById("file-input");

    //accepted formats for profile photo
    let valid_image_formats = ["image/jpg" , "image/jpeg", "image/png"]


      
    //send photo to server if chosen and no error
    if (file.files[0]) 
    {
        //if selected file was OK
        if (valid_image_formats.includes(file.files[0].type))
        {
            //hide error box
            $("#error-alert-photo").hide();

            return true;
        }
        
        //if selected file was NOT in accepted formats
        else
        {
            $("#error-alert-photo").html("Just <b>JPEG, JPG</b> or <b>PNG</b> files are accepted.");
            $("#error-alert-photo").show();

            return false;
        }
    }

    
    //if no photo chosen - (profile photo)
    else 
    {
        $("#error-alert-photo").html("You should choose a photo.");
        $("#error-alert-photo").show();

        return false;
    }
}



// *********************************************************************************
//                                      Edit Article
// *********************************************************************************

function edit_article(part, value)
{
    //Title length check
    if (part === "title")
    {
        if (value.trim().length < 2 || value.trim().length > 70) {
            return ("*Title MUST long at least <b>2</b> and at last <b>70</b>");
        }
    }

    //Summary length check
    else if (part === "summary")
    {
        if (value.trim().length < 100 || value.trim().length > 400) {
            return ("*Summary MUST long at least <b>100</b> and at last <b>400</b>");
        }
    }

    //Content length check
    else if (part === "content")
    {
        if (value.trim().length < 500 || value.trim().length > 15000) {
            return ("*Title MUST long at least <b>500</b> and at last <b>10000</b>");
        }
    }
    

    //no errors in data input
    return true;
}