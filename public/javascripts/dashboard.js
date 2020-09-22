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
                alert("Something went wrong! Try again.");
            }
        }
    });
});