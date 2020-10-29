//client-side input validator
import {VALIDATOR} from './input-validator-client.js';


// *********************************************************************************
//                                Edit Section Buttons
// *********************************************************************************

// *****************************************************
//                     'Edit' button
// *****************************************************

$("#edit-btn").on("click", function () 
{  
    //hide field info
   $(".info-container p span").hide();

   //show textbox
   $(".edit-box").show();

   //put right check-mark for gender box
   if ($("#gender").html() === "Male") {
       $("#Female").removeAttr("checked");
       $("#Male").attr("checked", true);
   }
   else {
       $("#Male").removeAttr("checked");
       $("#Female").attr("checked", true);
   }


   //hide edit button
   $(this).hide();
   $("#cancel-btn").show();
   $("#apply-btn").show();
});


// *****************************************************
//                   'Cancel' button
// *****************************************************

$("#cancel-btn").on("click", function () 
{  
    //assign previous values to edit boxes
    $("#fname-box").val($("#fname-box").prev().html());
    $("#lname-box").val($("#lname-box").prev().html());
    $("#username-box").val($("#username-box").prev().html());
    $("#phone-box").val($("#phone-box").prev().html());


    //assign previous gender to gender box
    if ($("#gender").html() === 'Male') {
        $("#Female").removeAttr("checked");
        $("#Male").attr("checked", true);
        $("#Male").prop("checked", true);
    }

    else {
        $("#Male").removeAttr("checked");
        $("#Female").attr("checked", true);
        $("#Female").prop("checked", true);
    }

    
    cancel_edit();
});


// *****************************************************
//                     'Apply' button
// *****************************************************

$("#apply-btn").on("click", async function () 
{  
    //values of edit boxes
    let inputs_data = {
        fname: $("#fname-box").val(),
        lname: $("#lname-box").val(),
        username: $("#username-box").val(),
        mobile: $("#phone-box").val()
    }

    //if there is no length error or warning
    if (VALIDATOR.profile_edit(inputs_data) === true)
    {
        try {
            //if no duplicate
            if (await duplicate_check(inputs_data.username, inputs_data.mobile) === "No Conflict") 
            {
                inputs_data.sex = $("input[type=radio][checked]").attr("id");

                //save chnges to database
                save_profile_changes(inputs_data);
            }
        }

        catch (err) {
            console.log(err);
        }
    }
});


// *****************************************************
//           save user-info changes to database
// *****************************************************

function save_profile_changes (user_info) 
{  
    //show loading
    $("#loading-edit").show();
    $("#cancel-btn").hide();
    $("#apply-btn").hide();


    $.ajax({
        type: "PUT",
        url: "/user/edit",
        data: user_info,

        success: function (result, status, xhr) 
        {
            //assign new values to fields
            $("#fname-box").prev().html(user_info.fname);
            $("#lname-box").prev().html(user_info.lname);
            $("#username-box").prev().html(user_info.username);
            $("#gender").html(user_info.sex);
            $("#phone-box").prev().html(user_info.mobile);

            cancel_edit();

            //changes were successful
            alert("Changes Applied.");
            $("#loading-edit").hide();
            $("#edit-btn").show();
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //session timed out
            if (xhr.status === 403) {
                window.location.assign('/signin');
            }

            //server error
            else if (xhr.status === 500) {
                alert("Something went wrong in saving! Try again.");
                $("#loading-edit").hide();
                $("#cancel-btn").trigger("click");
            }
        }
    }); 
}



// *********************************************************************************
//                                Change Password
// *********************************************************************************

//Change Password button
$("#change-password").on('click', function () {  
    //open change password panel
    $("#password-modal-btn").trigger("click");
});


//close buttons
$(".password-close-btns").on('click', function () 
{  
    //clear fields (for security)
    $("#old-p-box").val('');
    $("#new-p-box").val('');
    $("#repeat-p-box").val('');

    //hide alerts
    $("#old-password-length-warning").css("visibility", "hidden");
    $("#new-password-length-warning").css("visibility", "hidden");
    $("#repeat-password-length-warning").css("visibility", "hidden");
    $("#error-alert-password").hide();

    changes_for_password_change("not-loading");
});


//Apply button (in change password page)
$("#apply-password-change").on('click', function () 
{  
    //values of password boxes
    let passwords = {
        old: $("#old-p-box").val(),
        new: $("#new-p-box").val(),
        repeat: $("#repeat-p-box").val()
    }

    if (VALIDATOR.password_change(passwords) === true) 
    {
        changes_for_password_change("is-loading");
 
        change_password(passwords);
    }
});


// *****************************************************
//              save new password database
// *****************************************************

function change_password (passwords)
{
    //send password change request to the server
    $.ajax({
        type: "PUT",
        url: "/user/password",
        data: passwords,

        success: function (result, status, xhr) 
        {
            //close the change password panel
            $(".password-close-btns").trigger("click");

            changes_for_password_change("not-loading");

            //changes were successful
            alert("Password changed successfully.");

            //log out the user to sign-in again
            $("#logout-btn").trigger("click");
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //session timed out
            if (xhr.status === 403) {
                alert("You should sign-in again.")
                window.location.assign('/signin');
            }

            //password is not correct
            if (xhr.status === 404) 
            {
                changes_for_password_change("not-loading");
                
                //show error
                $("#error-alert-password").html(xhr.responseText);
                $("#error-alert-password").show();
            }

            //server error
            else if (xhr.status === 500) {
                changes_for_password_change("not-loading");
                alert("Something went wrong in saving! Try again.");
            }
        }
    }); 
}



// *********************************************************************************
//                              Change Profile Photo
// *********************************************************************************

//*** some operations are in 'VALIDATOR' module ***


//open 'Change Photo' panel when cliked on 'Change Photo' area
$("#add-photo").on("click", function () {  
    $("#photo-modal-btn").trigger("click");
});

//Apply button (in profile-photo panel)
$("#apply-photo-change").on("click", function () 
{  
    if (VALIDATOR.avatar_change() === true) {
        change_avatar();
    }
});



// *****************************************************
//           save user's new avatar to database
// *****************************************************

function change_avatar () 
{  
    changes_for_photo_change("is-loading");
    

    //make a form data for sending image to ther server
    let form_data = new FormData();
    let avatar = document.getElementById("file-input").files[0];
    form_data.append('avatar', avatar);

    
    $.ajax({
        type: "PUT",
        url: "/user/avatar",
        data: form_data,
        contentType: false,
        processData: false,

        success: function (result, status, xhr) 
        {
            //changes were successful
            alert("Photo changed successfully.");
            
            //change the avatar photo in dashboard to the new one
            //(use preview-image src)
            $("#avatar").attr("src", `${$("#preview").attr("src")}`);

            changes_for_photo_change("not-loading");

            //close the change photo panel
            $(".photo-close-btns").trigger("click");
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //session timed out
            if (xhr.status === 403) {
                alert("You should sign-in again.")
                window.location.assign('/signin');
            }

            //server error
            else if (xhr.status === 500) {
                changes_for_photo_change("not-loading");
                alert("Something went wrong in saving! Try again.");
            }
        }
    }); 
}


// *****************************************************
//                 remove user's avatar
// *****************************************************

$("#remove-photo").on("click", function () 
{  
    if (confirm("Are you sure to remove your avatar?")) {
        remove_avatar();
    }
});


// *****************************************************
//                 remove user's avatar
// *****************************************************

function remove_avatar () 
{  
    changes_for_photo_change("is-loading");

  
    //send remove avatar request to the server
    $.ajax({
        type: "DELETE",
        url: "/user/avatar",

        success: function (result, status, xhr) 
        {
            //change the avatar photo in dashboard to the default
            $("#avatar").attr("src", "/images/default-profile-pic.jpg");

            changes_for_photo_change("not-loading");

            //close the change photo panel
            $(".photo-close-btns").trigger("click");

            //changes were successful
            alert("Photo removed successfully.");
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //session timed out
            if (xhr.status === 403) {
                alert("You should sign-in again.")
                window.location.assign('/signin');
            }

            //default avatar error
            if (xhr.status === 400) {
                changes_for_photo_change("not-loading");
                alert("Default avatar can Not be removed.")
            }

            //server error
            else if (xhr.status === 500) {
                changes_for_photo_change("not-loading");
                alert("Something went wrong in removing photo!");
            }
        }
    }); 
}



// *********************************************************************************
//                                    Check Ups
// *********************************************************************************

// *****************************************************
//       'Username' and 'Mobile' duplicate check
// *****************************************************

function duplicate_check (username, mobile) 
{
    //show loading
    $("#loading-edit").show();
    $("#cancel-btn").hide();
    $("#apply-btn").hide();

    
    //send duplicate check request to the server
    return $.ajax({
        type: "POST",
        url: "/user/edit",
        data: { username, mobile },

        //no duplicate
        success: function (result, status, xhr) 
        {
            //hide error box
            $("#error-alert").hide();

            $("#loading-edit").hide();
            $("#apply-btn").show();
            $("#cancel-btn").show();
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //duplicate error
            if (xhr.status === 409) 
            {
                $("#error-alert").html(xhr.responseText);
                $("#error-alert").show();
                $("html").scrollTop(290);

                $("#loading-edit").hide();
                $("#apply-btn").show();
                $("#cancel-btn").show();
            }

            //session timed out
            else if (xhr.status === 403) {
                window.location.assign('/signin');
            }

            //server error
            else if (xhr.status === 500) {
                alert("Something went wrong in duplicate check! Try again.");

                $("#loading-edit").hide();
                $("#apply-btn").show();
                $("#cancel-btn").show();
            }
        }
    });
}



// *********************************************************************************
//                               Appearance changes
// *********************************************************************************

//hiding and showing buttons and boxes when 'cancel' button is clicked
//for profile edit
function cancel_edit () 
{
    //show fields and 'edit' Button
    $(".info-container p span").show();
    $("#edit-btn").show();

    //hide edit-textboxes
    $(".edit-box").hide();

    //hide 'cancel' and 'apply' Buttons
    $("#apply-btn").hide();
    $("#cancel-btn").hide();

    //hide alert box
    $("#error-alert").hide();
}


//hiding and showing buttons and boxes when 'apply' or 'cancel' button is clicked
//for password change
function changes_for_password_change (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-password").hide();      
        $(".password-close-btns").hide();
        $("#apply-password-change").hide();

        //show loading
        $("#loading-password").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-password").hide();
                    
        //show buttons
        $(".password-close-btns").show();
        $("#apply-password-change").show();
    }
}


//hiding and showing buttons and boxes when 'apply' or 'cancel' button is clicked
//for photo change
function changes_for_photo_change (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-photo").hide();      
        $(".photo-close-btns").hide();
        $("#apply-photo-change").hide();

        //hide choose file
        $("#file-input-container").hide();

        //show loading
        $("#loading-photo").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-photo").hide();

        //show choose file
        $("#file-input-container").show();
                    
        //show buttons
        $(".photo-close-btns").show();
        $("#apply-photo-change").show();
    }
}


//change gender from 'Female' to 'Male'
$("#Male").on("click", function () {
    $("#Female").removeAttr("checked");
    $(this).attr("checked", true);
});

//change gender from 'Male' to 'Female'
$("#Female").on("click", function () {
    $("#Male").removeAttr("checked");
    $(this).attr("checked", true);
});