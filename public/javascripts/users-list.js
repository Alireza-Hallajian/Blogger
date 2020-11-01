// *********************************************************************************
//                             'delete user' button
// *********************************************************************************

$(".delete-user-button").on("click", function () 
{  
    let username = $(this).parent().find("td.uname_td").text();
    let parent_row = $(this).parent();


    if (confirm(`You are aboute to DELETE a user with username: ' ${username} '.\nAre you sure?!`))
    {
        changes_for_bloggers_list("is-loading");

        let user_id = $(this).parent().find("td.id_td").text();
    
        $.ajax(
            {
                type: "DELETE",
                url: `/user/bloggers/${user_id}`,
    
                success: function (result, status, xhr) 
                {
                    alert(`User: ' ${username} ' deleted successfully.`);
                    $(parent_row).remove();
    
                    changes_for_bloggers_list("not-loading");
                },
    
                error: function (xhr, status, error) 
                {
                    //session timed out
                    if (xhr.status === 403) {
                        window.location.assign('/signin');
                    }
    
                    //user_id error or user not found
                    else if (xhr.status === 400 || xhr.status === 404) 
                    {
                        changes_for_bloggers_list("not-loading");
                        alert(xhr.responseText);
                    }
    
                    //server error
                    else if (xhr.status === 500) {
                        changes_for_bloggers_list("not-loading");
                        alert("Something went wrong in finding or deleting the user!");
                    }
                }
            });
    }
});



// *********************************************************************************
//                             'reset password' button
// *********************************************************************************

$(".reset-password-button").on("click", function () 
{  
    let username = $(this).parent().find("td.uname_td").text();


    if (confirm(`You are aboute to reset a user's password with username: ' ${username} '.\nAre you sure?!`))
    {
        changes_for_bloggers_list("is-loading");

        let user_id = $(this).parent().find("td.id_td").text();
    
        $.ajax(
            {
                type: "PUT",
                url: `/user/bloggers/${user_id}`,
    
                success: function (result, status, xhr) 
                {
                    alert(`User: ' ${username} 's password reset successfully.`);
    
                    changes_for_bloggers_list("not-loading");
                },
    
                error: function (xhr, status, error) 
                {
                    //session timed out
                    if (xhr.status === 403) {
                        window.location.assign('/signin');
                    }
    
                    //user_id error or user not found
                    else if (xhr.status === 400 || xhr.status === 404) 
                    {
                        changes_for_bloggers_list("not-loading");
                        alert(xhr.responseText);
                    }
    
                    //server error
                    else if (xhr.status === 500) {
                        changes_for_bloggers_list("not-loading");
                        alert("Something went wrong in finding or deleting the user!");
                    }
                }
            });
    }
});



// *********************************************************************************
//                             Appearance Changes
// *********************************************************************************

// *****************************************************
//       show and hide 'delete user' and 
//    'reset password' buttons on Mouse Move
// *****************************************************

$("tr").mouseenter(function () { 
    $(this).children("td.buttons").css("visibility", "visible");  
});

$("tr").mouseleave(function () { 
    $(this).children("td.buttons").css("visibility", "hidden");  
});


// *****************************************************
//     change background-color of 'tr's on Mouse Move
// *****************************************************

$("tr td").mouseenter(function () { 
    $(this).parent().css({"background-color": "#1a1a1a", "color": "white"}); 
});

$("tr td").mouseleave(function () { 
    $(this).parent().css({"background-color": "white", "color": "black"}); 
});


// *****************************************************
//   for deleting a user or resetting its password
// *****************************************************

//hiding and showing buttons and boxes when 'delete user' or 'reset password' button is clicked
function changes_for_bloggers_list (status) 
{
    if (status === "is-loading")
    {
        //hide bloggers table
        $("#main-table").hide();      

        //show loading
        $("#loading-bloggers-list").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-bloggers-list").hide();

        //show bloggers table
        $("#main-table").show();      
    }
}