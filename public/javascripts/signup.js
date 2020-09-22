// *********************************************************************************
//                                     Validation
// *********************************************************************************

function input_validator(data) 
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
    if (data.fname.length < 2 || data.fname.length > 15) {
        $("#fname-length-warning").css("visibility", "visible");
    } else {
        $("#fname-length-warning").css("visibility", "hidden");
    }

    //Last Name length check
    if (data.lname.length < 3 || data.lname.length > 20) {
        $("#lname-length-warning").css("visibility", "visible");
    } else {
        $("#lname-length-warning").css("visibility", "hidden");
    }

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

    //Mobile Number length check
    if (data.mobile.length !== 11) {
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

//change gender from 'female' to 'male'
$("#male").on("click", function () {
    $("#female").removeAttr("checked");
    $(this).attr("checked", "");
});

//change gender from 'male' to 'female'
$("#female").on("click", function () {
    $("#male").removeAttr("checked");
    $(this).attr("checked", "");
});

//click on 'Great' button
$("#great-btn").on("click", function (target) {
    window.location.assign("/signin");
});


//click on 'sign-up' button
$("#signup-button").on("click", function () 
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
    if (input_validator(inputs_data) === true) 
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
                $("#modal-btn").trigger("click");
            },

            //show error ine alert-box
            error: function (xhr, status, error) 
            {
                //user exists
                if (xhr.status === 400) {
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