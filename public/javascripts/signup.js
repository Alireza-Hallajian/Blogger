// *********************************************************************************
//                                  Sign-up Operation
// *********************************************************************************

//client-side input validator
import {VALIDATOR} from './input-validator-client.js';


//click on 'sign-up' button
$("#signup-btn").on("click", function () 
{
    let inputs_data = {
        fname: $("#firstname-box").val(),
        lname: $("#lastname-box").val(),
        username: $("#username-box").val(),
        password: $("#password-box").val(),
        password_repeat: $("#password-repeat-box").val(),
        mobile: $("#mobile-box").val()
    }
    

    //send data to the server if there is no errors
    if (VALIDATOR.signup(inputs_data) === true) 
    {
        //no need to send password to server twice
        delete inputs_data.password_repeat;

        //add gender to the data
        inputs_data.sex = $(".gender[checked]").attr("id");


        //hide 'user-existence-alert' box before sending data to the server
        $("#user-existence-alert").hide();


        //send data to the server
        $.ajax({
            type: "POST",
            url: "/signup",
            data: inputs_data,

            success: function (result,status,xhr) {
                //show success message and go to 'sign-in' page
                $("#modal-btn").trigger("click");
            },

            //show error ine alert-box
            error: function (xhr, status, error) 
            {
                //user is already logged-in
                if (xhr.status === 303) {
                    alert("You are already logged-in");
                    return window.location.assign("/user/dashboard");
                }

                //user exists
                if (xhr.status === 409) {
                    $("#user-existence-alert").html(xhr.responseText);
                    $("#user-existence-alert").show();
                    $("html").scrollTop(290);
                }
                
                //server error
                else if (xhr.status === 500) {
                    $("#error-alert").html(xhr.responseText);
                    $("#error-alert").show();
                    $("html").scrollTop(290);
                }
            }
        });
    }
});


// *********************************************************************************
//                                 Minor Operations
// *********************************************************************************

//change gender from 'Female' to 'Male'
$("#Male").on("click", function () {
    $("#Female").removeAttr("checked");
    $(this).attr("checked", true);
});

// change gender from 'Male' to 'Female'
$("#Female").on("click", function () {
    $("#Male").removeAttr("checked");
    $(this).attr("checked", true);
});

//click on 'Great' button
$("#great-btn").on("click", function (target) {
    window.location.assign("/signin");
});