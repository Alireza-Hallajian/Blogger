// *********************************************************************************
//                                  Sign-in Operation
// *********************************************************************************

//client-side input validator
import {VALIDATOR} from './input-validator-client.js';


//click on 'sign-in' button
$("#signin-button").on("click", function () 
{
    let inputs_data = {
        username: $("#username-box").val(),
        password: $("#password-box").val()
    }

    //send data to the server if there is no input errors
    if (VALIDATOR.signin(inputs_data) === true) 
    {
        //send data to the server
        $.ajax({
            type: "POST",
            url: "/signin",
            data: inputs_data,

            success: function (result,status,xhr) {
                //go to 'dashboard' page
                window.location.assign(result);
            },

            //show error ine alert-box
            error: function (xhr, status, error) 
            {
                //user is already logged-in
                if (xhr.status === 303) {
                    alert("You are already logged-in");
                    return window.location.assign("/user/dashboard");
                }

                //user does not exist or username/password is not correct
                if (xhr.status === 404) {
                    $("#error-alert").html(xhr.responseText);
                    $("#error-alert").show();
                    $("html").scrollTop(210);
                }
                
                //server error
                else if (xhr.status === 500) {
                    $("#error-alert").html(xhr.responseText);
                    $("#error-alert").show();
                    $("html").scrollTop(210);
                }
            }
        });
    }
});