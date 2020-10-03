//client-side input validator
import {VALIDATOR} from './input-validator-client.js';


// *********************************************************************************
//                                  Buttons Actions
// *********************************************************************************

//'Edit' button
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


//'Cancel' button
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

    
    changes_for_edit();
});



//'Apply' button
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
    if (VALIDATOR.edit(inputs_data) === true)
    {
        try {
            //if no duplicate
            if (await duplicate_check(inputs_data.username, inputs_data.mobile) === "No Conflict") 
            {
                inputs_data.sex = $("input[type=radio][checked]").attr("id");

                //save chnges to database
                save_changes(inputs_data);
            }
        }

        catch (err) {
            console.log(err);
        }
    }
});


// *********************************************************************************
//                                Change Password
// *********************************************************************************

//Change Password button
$("#change-password").on('click', function () {  
    $("#modal-btn").trigger("click");
});


//close button
$("#close-btn-top, #close-btn-bottom").on('click', function () 
{  
    //clear fields (for security)
    $("#old-p-box").val('');
    $("#new-p-box").val('');
    $("#repeat-p-box").val('');

    //hide alerts
    $("#old-password-length-warning").css("visibility", "hidden");
    $("#new-password-length-warning").css("visibility", "hidden");
    $("#repeat-password-length-warning").css("visibility", "hidden");
    $("#error-alert-modal").hide();

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

    if (VALIDATOR.p_change(passwords) === true) 
    {
        changes_for_password_change("is-loading");
 

        //send password change request to the server
        $.ajax({
            type: "PUT",
            url: "/user/password",
            data: passwords,
    
            success: function (result, status, xhr) 
            {
                //changes were successful
                alert("Password changed successfully.");

                //close the change password panel
                $("#close-btn-bottom").trigger("click");

                changes_for_password_change("not-loading");


                //log out the user to sign-in again
                $("#logout-btn").trigger("click");
            },
    
            //show error in alert-box
            error: function (xhr, status, error) 
            {
                //session timed out
                if (xhr.status === 403) {
                    window.location.assign('/signin');
                }

                //password is not correct
                if (xhr.status === 404) 
                {
                    changes_for_password_change("not-loading");
                    
                    //show error
                    $("#error-alert-modal").html(xhr.responseText);
                    $("#error-alert-modal").show();
                }
    
                //server error
                else if (xhr.status === 500) {
                    alert("Something went wrong in saving! Try again.");
                }
            }
        }); 
    }
});


// *********************************************************************************
//                                   Data Base
// *********************************************************************************

//save chnges to database
function save_changes (user_info) 
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

            changes_for_edit();

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
//                                    Check Ups
// *********************************************************************************

//'Username' and 'Mobile' duplicate check
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
//                                  Log Out
// *********************************************************************************

$("#logout-btn").on("click", function ()
{
    //send log-out request to the server
    $.ajax({
        type: "DELETE",
        url: "/user",

        success: function (result,status,xhr) {
            window.location.assign(result);
        },

        //show error ine alert-box
        error: function (xhr, status, error) 
        {
            //forbidden error (when server restarts and sessions are cleared)
            if (xhr.status === 403) {
                window.location.assign("/");
            }

            //server error
            if (xhr.status === 500) {
                alert("Something went wrong logging out! Try again.");
            }
        }
    });
});


// *********************************************************************************
//                                Minor Operations
// *********************************************************************************

//hiding and showing buttons and boxes when 'apply' or 'cancel' button is clicked
//for profile edit
function changes_for_edit () 
{
    //show fields and 'edit' Button
    $(".info-container p span").show();
    $("#edit-btn").show();

    //hide edit-textboxes
    $(".edit-box").hide();

    //hide 'cancel; and 'apply' Buttons
    $("#apply-btn").hide();
    $("#cancel-btn").hide();
}


//hiding and showing buttons and boxes when 'apply' or 'cancel' button is clicked
//for password change
function changes_for_password_change (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-modal").hide();      
        $("#close-btn-bottom").hide();
        $("#apply-password-change").hide();

        //show loading
        $("#loading-password").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-password").hide();
                    
        //show buttons
        $("#close-btn-bottom").show();
        $("#apply-password-change").show();
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