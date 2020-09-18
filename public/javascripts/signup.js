// *********************************************************************************
//                                     Functions
// *********************************************************************************

function input_validator(data) 
{
    // empty field check
    if (!data.fname || !data.lname || !data.username || !data.password || !data.phone) {
        alert("All fields Must be filled.")
    }

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

    //Phone Number length check
    if (data.phone.length !== 11) {
        $("#phone-length-warning").css("visibility", "visible");
    } else {
        $("#phone-length-warning").css("visibility", "hidden");
    }


    // *****************************************************
    //                     Warning Check
    // *****************************************************

    //check if there is anything than number in 'Phone Number' Box
    for (let i = 0; i < data.phone.length; i++) 
    {
        if (isNaN(Number(data.phone.charAt(i))) === true) 
        {
            $("#number-validation-warning").css("visibility", "visible");
            return false;   //incorrect data input.
        }

        else {
            $("#number-validation-warning").css("visibility", "hidden");
        }
    }


    //data input (pre)-IDs 
    let input_boxes_arr = ["firstname", "lastname", "username", "password", "phone"];

    //send name of the data inputs to check if there is any warning
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



//click on 'sign-up' button
$("#signup-button").on("click", function () {
    let inputs_data = {
        fname: $("#firstname-box").val(),
        lname: $("#lastname-box").val(),
        username: $("#username-box").val(),
        password: $("#password-box").val(),
        phone: $("#phone-box").val()
    }

    // console.log(inputs_data);


    console.log(input_validator(inputs_data));

    //check 'fields not to be empty
    // if (!fname || !lname || !username || !password || !phone) {
    //     return alert("All fields Must be filled.")
    // }



    //save user info in an Object to be sent
    // let new_user_info = {
    //     fname,
    //     lname,
    //     username,
    //     password,
    //     phone,
    //     gender: $(".gender[checked]").attr("id")
    //     // isLoggedIn: false
    // };


    //send data to be saved
    // $.ajax({
    //     type: "POST",
    //     url: "/usersInfo",
    //     data: {"user": new_user_info},

    //     success: function (response) 
    //     {
    //         //if an error occured, alert it
    //         if (response === 'Username Exists!' || response === 'Email Exists!') {
    //             alert(response);
    //         }

    //         //go to '/signIn' page
    //         else {
    //             window.location.assign(response);
    //         }
    //     }
    // });
});

