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
       $("#Male").attr("checked", "");
   }
   else {
       $("#Male").removeAttr("checked");
       $("#Female").attr("checked", "");
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

    //******************************************************
    //                    DOES NOT WORK                      
    //******************************************************
    if ($("#gender").html() === 'Male') {
        $("#Female").removeAttr("checked");
        $("#Male").attr("checked", "");
    }
    else {
        $("#Male").removeAttr("checked");
        $("#Feale").attr("checked", "");
    }

    button_and_boxes_changes();
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
    if (input_validator(inputs_data) === true)
    {
        //if no duplicate
        if (duplicate_check(inputs_data.username, inputs_data.mobile) === false) 
        {
            inputs_data.sex = $("input[type=radio][checked]").attr("id");  

            //save chnges to database
            save_changes(inputs_data);
        }
    }
});


// *********************************************************************************
//                                   Data Base
// *********************************************************************************

//save chnges to database
async function save_changes (user_info) 
{  
    //show loading
    $("#loading1").show();
    $("#cancel-btn").hide();
    $("#apply-btn").hide();


    await $.ajax({
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

            button_and_boxes_changes();

            //changes were successful
            alert("Changes Applied.");
            $("#loading1").hide();
            $("#edit-btn").show();
        },

        //show error in alert-box
        error: function (xhr, status, error) {
            //server error
            alert("Something went wrong in saving! Try again.");
            $("#loading1").hide();
            $("#cancel-btn").trigger("click");
        }
    }); 
}



// *********************************************************************************
//                                    Check Ups
// *********************************************************************************

//length and warning check for inputs while editing
function input_validator(data) 
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


//'Username' and 'Mobile' duplicate check
async function duplicate_check (username, mobile) 
{
    let duplicate_check_result = false;     //No duplicate

    //show loading
    $("#loading1").show();
    $("#cancel-btn").hide();
    $("#apply-btn").hide();


    //send duplicate check request to the server
    await $.ajax({
        type: "POST",
        url: "/user/edit",
        data: {username, mobile},

        //no duplicate
        success: function (result, status, xhr) 
        {
            //hide error box
            $("#error-alert").hide();

            $("#loading1").hide();
            $("#apply-btn").show();
            $("#cancel-btn").show();
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //duplicate error
            if (xhr.status === 409) {
                $("#error-alert").html(xhr.responseText);
                $("#error-alert").show();
                $("html").scrollTop(290);

                $("#loading1").hide();
                $("#apply-btn").show();
                return $("#cancel-btn").show();

                //for returning the result
                duplicate_check_result = true;
            }
            
            //server error
            if (xhr.status === 500) {
                alert("Something went wrong in duplicate check! Try again.");
            }
        }
    });


    //true or false
    return duplicate_check_result;
}


// *********************************************************************************
//                                Minor Operations
// *********************************************************************************

//hiding and showing buttons and boxes when 'apply' or 'cancel' button is clicked
function button_and_boxes_changes () 
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


//change gender from 'Female' to 'Male'
$("#Male").on("click", function () {
    $("#Female").removeAttr("checked");
    $(this).attr("checked", "");
});

//change gender from 'Male' to 'Female'
$("#Female").on("click", function () {
    $("#Male").removeAttr("checked");
    $(this).attr("checked", "");
});


//log-out
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
            //server error
            if (xhr.status === 500) {
                alert("Something went wrong logging out! Try again.");
            }
        }
    });
});