//client-side input validator
import {VALIDATOR} from './input-validator-client.js';


// *********************************************************************************
//                                    Add Comment
// *********************************************************************************

$("#add-comment-btn").on("click", function (event) 
{ 
    let comment_length_val = VALIDATOR.add_comment($("#add-comment-box").val());

    if (comment_length_val === true && confirm("Are you sure to add this comment?"))
    {
        // 'section' with class="comment-box" and id=`articles_info.id`
        let article_info_container = $(this).parent().parent();

        let article_id = $(article_info_container).attr("id");


        changes_for_add_comment("is-loading");

        $.ajax(
        {
            type: "POST",
            url: `/comment/${article_id}`,
            data: {comment: $("#add-comment-box").val()},
    
            success: function (result, status, xhr) {
                alert("Comment added successfully.");
                location.reload();
            },
    
            error: function (xhr, status, error) 
            {
                //session timed out
                if (xhr.status === 403) {
                    window.location.assign('/signin');
                }

                //session timed out
                if (xhr.status === 404) {
                    changes_for_add_comment("not-loading");
                    alert("Article Not found");
                }
    
                //server error
                else if (xhr.status === 500) {
                    changes_for_add_comment("not-loading");
                    alert("Something went wrong in deleting comment! Try again.");
                }
            }
        });
    }
});



// *********************************************************************************
//                                    Delete Comment
// *********************************************************************************

$(".delete-comment-btn").on("click", function (event) 
{ 
    if (confirm("Are you sure to DELETE this comment?"))
    {
        // 'section' with class="comment-box" and id=`comments_info.id`
        let comment_info_container = $(this).parent().parent().parent();

        let comment_id = $(comment_info_container).attr("id");

        $.ajax(
        {
            type: "DELETE",
            url: `/comment/${comment_id}`,
    
            success: function (result, status, xhr) 
            {
                alert("Comment deleted successfully.")
    
                //remove the article-info panel
                $(comment_info_container).remove();
            },
    
            error: function (xhr, status, error) 
            {
                //session timed out
                if (xhr.status === 403) {
                    window.location.assign('/signin');
                }

                //session timed out
                if (xhr.status === 404) {
                    alert("Comment Not found");
                }
    
                //server error
                else if (xhr.status === 500) {
                    alert("Something went wrong in deleting comment! Try again.");
                }
            }
        });
    }
});



// *********************************************************************************
//                               Appearance changes
// *********************************************************************************

// *****************************************************
//                 for add comment
// *****************************************************

//hiding and showing buttons and boxes when 'Add Comment' button is clicked
function changes_for_add_comment (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-comment").hide();    
        $("#add-comment-btn").hide();  

        //show loading
        $("#loading-comment").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-comment").hide();
                    
        //show buttons
        $("#add-comment-btn").show();
    }
}