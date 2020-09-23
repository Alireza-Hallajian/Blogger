// *********************************************************************************
//                                     Validation
// *********************************************************************************

function input_validator(data) 
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
    if (data.username.length < 3 || data.username.length > 10) {
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
//                                     Operations
// *********************************************************************************

//click on 'sign-in' button
$("#signin-button").on("click", function () 
{
    let inputs_data = {
        username: $("#username-box").val(),
        password: $("#password-box").val()
    }


    //send data to the server if there is no errors
    if (input_validator(inputs_data) === true) 
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