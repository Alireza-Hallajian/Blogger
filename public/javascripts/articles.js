//client-side input validator
import {VALIDATOR} from './input-validator-client.js';


// *********************************************************************************
//                            TinyMCE Config (Text Editor)
// *********************************************************************************

tinymce.init({
    selector: '#article-sheet',

    plugins: 'autoresize wordcount',
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | wordcount',

    autoresize_overflow_padding: 10,
    max_height: 1000,
    min_height: 480,

    auto_focus : "article-sheet",

    init_instance_callback: function () {  
        $("#loading-article").css("display", "none");
        $("#article-container form").css("display", "block");
    },

    add_unload_trigger : true,   //text remains in editor if page unloaded

    setup: function (editor) 
    {
        editor.on('change', function () {
            editor.save();
        });
    }
});


// *****************************************************
//              Characters and Words Cont
// *****************************************************

//Returns text statistics for the specified editor by id, also counts HTML tags
function get_stats(id) 
{
    let body = tinymce.get(id).getBody();
    let text = tinymce.trim(body.innerText || body.textContent);    

    //just return number of characters
    return {
        chars: text.length
        // words: text.split(/[\w\u2019\'-]+/).length
    }
}



// *********************************************************************************
//          show loading until the article is completely ready to be shown
// *********************************************************************************

//change article content from string to HTML content
$("#content").html($("#content").text());

$("#loading-article-show").hide();
$("#content").show();



// *********************************************************************************
//                                    Edit Article
// *********************************************************************************

//get edit page
$(".edit-article-btn").on("click", function (event) 
{ 
    // 'section' with class="article-box" and id=`article_id`
    let article_info_container = $(this).parent().parent().parent();

    let article_id = $(article_info_container).attr("id");

    window.location.assign(`/article/edit/${article_id}`);
});


// *****************************************************
//                     Edit Title
// *****************************************************

$("#title-edit-btn").on("click", function (event) 
{ 
    let new_title = $("#edit-title-input").val();


    //check new title to have valid length
    let new_title_val = VALIDATOR.edit_article("title", new_title);

    //if NOT valid
    if (new_title_val !== true) 
    {
        $("#error-alert-title-edit").html(new_title_val);
        $("#error-alert-title-edit").show();
    }

    else 
    {
        $("#error-alert-title-edit").hide();

        changes_for_article_title_edit("is-loading");

        let article_id = $("#article_id_for_edit_article").text();

        $.ajax(
        {
            type: "PUT",
            url: `/article/edit/title/${article_id}`,
            data: {new_title},

            success: function (result, status, xhr) 
            {
                alert("Article title updated successfully.");

                changes_for_article_title_edit("not-loading");
            },

            error: function (xhr, status, error) 
            {
                //session timed out
                if (xhr.status === 403) {
                    window.location.assign('/signin');
                }

                //article_id error
                else if (xhr.status === 400) 
                {
                    $("#error-alert-title-edit").html(xhr.responseText);
                    $("#error-alert-title-edit").show();

                    changes_for_article_title_edit("not-loading");
                }
                
                //length error
                else if (xhr.status === 406) 
                {
                    $("#error-alert-title-edit").html(xhr.responseText);
                    $("#error-alert-title-edit").show();

                    changes_for_article_title_edit("not-loading");
                }

                //conflict error
                else if (xhr.status === 409) 
                {
                    $("#error-alert-title-edit").html(xhr.responseText);
                    $("#error-alert-title-edit").show();

                    changes_for_article_title_edit("not-loading");
                }

                //server error
                else if (xhr.status === 500) {
                    changes_for_article_title_edit("not-loading");
                    alert("Something went wrong in updating or finding the article!");
                }
            }
        });
    }
});


// *****************************************************
//                    Edit Summary
// *****************************************************

$("#summary-edit-btn").on("click", function (event) 
{ 
    let new_summary = $("#summary-title-input").val();


    //check new title to have valid length
    let new_summary_val = VALIDATOR.edit_article("summary", new_summary);

    //if NOT valid
    if (new_summary_val !== true) 
    {
        $("#error-alert-summary-edit").html(new_summary_val);
        $("#error-alert-summary-edit").show();
    }

    else 
    {
        $("#error-alert-summary-edit").hide();

        changes_for_article_summary_edit("is-loading");

        let article_id = $("#article_id_for_edit_article").text();

        $.ajax(
        {
            type: "PUT",
            url: `/article/edit/summary/${article_id}`,
            data: {new_summary},

            success: function (result, status, xhr) 
            {
                alert("Article summary updated successfully.");

                changes_for_article_summary_edit("not-loading");
            },

            error: function (xhr, status, error) 
            {
                //session timed out
                if (xhr.status === 403) {
                    window.location.assign('/signin');
                }

                //article_id error
                else if (xhr.status === 400) 
                {
                    $("#error-alert-summary-edit").html(xhr.responseText);
                    $("#error-alert-summary-edit").show();

                    changes_for_article_summary_edit("not-loading");
                }
                
                //length error
                else if (xhr.status === 406) 
                {
                    $("#error-alert-summary-edit").html(xhr.responseText);
                    $("#error-alert-summary-edit").show();

                    changes_for_article_summary_edit("not-loading");
                }

                //conflict error
                else if (xhr.status === 409) 
                {
                    $("#error-alert-summary-edit").html(xhr.responseText);
                    $("#error-alert-summary-edit").show();

                    changes_for_article_summary_edit("not-loading");
                }

                //server error
                else if (xhr.status === 500) {
                    changes_for_article_summary_edit("not-loading");
                    alert("Something went wrong in updating or finding the article!");
                }
            }
        });
    }
});



// *********************************************************************************
//                                    Delete Article 
// *********************************************************************************

$(".delete-article-btn").on("click", function (event) 
{ 
    if (confirm("Are you sure to DELETE this article permanently?"))
    {
        // 'section' with class="article-box" and id=`article_id`
        let article_info_container = $(this).parent().parent().parent();

        let article_id = $(article_info_container).attr("id");

        $.ajax(
        {
            type: "DELETE",
            url: `/article/${article_id}`,
    
            success: function (result, status, xhr) 
            {
                alert("Article deleted successfully.")
    
                //remove the article-info panel
                $(article_info_container).remove();
            },
    
            error: function (xhr, status, error) 
            {
                //session timed out
                if (xhr.status === 403) {
                    window.location.assign('/signin');
                }
    
                //server error
                else if (xhr.status === 500) {
                    alert("Something went wrong in deleting article! Try again.");
                }
            }
        });
    }
});
// *********************************************************************************
//                              save article to database
// *********************************************************************************

$("#publish-btn").on("click", function (event) 
{ 
    //don't reload page on Submit
    event.preventDefault();

    // *****************************************************
    //                  Character Limit
    // *****************************************************

    //if characters of the article are less than 500
    if (get_stats('article-sheet').chars < 500){
        $("#error-alert-article").show();
        $("html").scrollTop(300);
        return $("#error-alert-article").html("<b>Min</b> characters allowed is <b>500</b>");
    }
    else {
        $("#error-alert-article").hide();
    }

    //if characters of the article are more than 10000
    if (get_stats('article-sheet').chars > 10000){
        $("#error-alert-article").show();
        $("html").scrollTop(300);
        return $("#error-alert-article").html("<b>Max</b> characters allowed is <b>10000</b>");
    }
    else {
        $("#error-alert-article").hide();
    }


    // *****************************************************
    //                 Add Summary of Article
    // *****************************************************

    //open summary panel
    $("#summary-modal-btn").trigger("click");

    let summary_char_count = 0;
    let title_char_count = 0;

    //count summary characters
    $("#summary-sheet").keyup(function () 
    { 
        summary_char_count = $(this).val().length;

        $("#char-count span").text(summary_char_count);
        
        if (summary_char_count > 400) {
            $("#char-count").css("color", "red");
        }
        else {
            $("#char-count").css("color", "black");
        }
    });

    
    //check summary and title characters and send to the server
    $("#expose-btn").click(function () 
    { 
        title_char_count = $("#article-title").val().length;

        if (title_char_count < 2 || title_char_count > 70) {
            $("#error-alert-summary").show();
            $("#error-alert-summary").html("<b>Title</b> characters MUST be between <b>2</b> and <b>70</b>.");
        }

        else if (summary_char_count < 100 || summary_char_count > 400) {
            $("#error-alert-summary").show();
            $("#error-alert-summary").html("<b>Summary</b> characters MUST be between <b>100</b> and <b>400</b>.");
        }

        else {
            $("#error-alert-summary").hide();
            save_article();
        }
    });
});


// *****************************************************
//              send article to the server
// *****************************************************

function save_article() 
{  
    //article parts
    let article = {
        title: $("#article-title").val(),
        summary: $("#summary-sheet").val(),
        content: $("#article-sheet").val()
    }

    changes_for_article_publish("is-loading");


    $.ajax(
    {
        type: "POST",
        url: "/article",
        data: article,

        success: function (result, status, xhr) 
        {
            alert("Article published successfully.")

            //hide loading
            changes_for_article_publish("not-loading");

            //close the panel
            $(".summary-close-btns").trigger("click");

            window.location.assign('/article/user');

            // //open the add photo panel
            // $("#article-photo-modal-btn").trigger("click");

            // //diselect chosen photo
            // document.getElementById("file-input-container").reset()
        },

        error: function (xhr, status, error) 
        {
            //session timed out
            if (xhr.status === 403) {
                window.location.assign('/signin');
            }

            //server error
            else if (xhr.status === 500) {
                changes_for_article_publish("not-loading");
                alert("Something went wrong in saving article! Try again.");
            }
        }
    });
}


// *********************************************************************************
//                              Add Avatar to Article
// *********************************************************************************

//*** some operations are in 'VALIDATOR' module ***


$("#skip-btn").on("click", function () 
{ 
    
    window.location.assign('/user');
});

//Finish button (in profile-photo panel)
$("#finish-btn").on("click", function () 
{  
    if (VALIDATOR.avatar_change() === true) {
        add_avatar_to_article();
    }
});


function add_avatar_to_article() 
{  
    //make a form data for sending image to ther server
    let form_data = new FormData();

    let article_title = $("#article-title").val();
    form_data.append('article_title', article_title);

    let avatar = document.getElementById("file-input").files[0];
    form_data.append('avatar', avatar);

    
    $.ajax({
        type: "PUT",
        url: "/article/avatar",
        data: form_data,
        contentType: false,
        processData: false,

        success: function (result, status, xhr) 
        {
            //changes were successful
            alert("Article avatar changed successfully.");

            changes_for_article_avatar("not-loading");

            //close the change photo panel
            $(".photo-close-btns").trigger("click");   

            window.location.assign('/article/user');
        },

        //show error in alert-box
        error: function (xhr, status, error) 
        {
            //session timed out
            if (xhr.status === 403) {
                alert("You should sign-in again.")
                window.location.assign('/signin');
            }

            //server error
            else if (xhr.status === 500) {
                changes_for_photo_change("not-loading");
                alert("Something went wrong in saving avatar! Try again.");
            }
        }
    }); 
}


// *********************************************************************************
//                               Appearance changes
// *********************************************************************************

// *****************************************************
//                 for article publish
// *****************************************************

//hiding and showing buttons and boxes when 'expose' button is clicked
function changes_for_article_publish (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-summary").hide();    
        $("#expose-btn").hide();  
        $(".summary-close-btns").hide();

        //show loading
        $("#loading-summary").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-summary").hide();
                    
        //show buttons
        $(".summary-close-btns").show();
        $("#expose-btn").show();
    }
}


// *****************************************************
//                 for article avatar
// *****************************************************

//hiding and showing buttons and boxes when 'finish' button is clicked
function changes_for_article_avatar (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-summary").hide();    
        $("#expose-btn").hide();  
        $(".summary-close-btns").hide();

        //show loading
        $("#loading-summary").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-summary").hide();
                    
        //show buttons
        $(".summary-close-btns").show();
        $("#expose-btn").show();
    }
}


// *****************************************************
//                 for article title-edit
// *****************************************************

//hiding and showing buttons and boxes when 'finish' button is clicked
function changes_for_article_title_edit (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-title-edit").hide();    
        $("#title-edit-btn").hide();  

        //show loading
        $("#loading-title-edit").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-title-edit").hide();
                    
        //show buttons
        $("#title-edit-btn").show();
    }
}



// *****************************************************
//                 for article summary-edit
// *****************************************************

//hiding and showing buttons and boxes when 'finish' button is clicked
function changes_for_article_summary_edit (status) 
{
    if (status === "is-loading")
    {
        //hide error box and buttons
        $("#error-alert-summary-edit").hide();    
        $("#summary-edit-btn").hide();  

        //show loading
        $("#loading-summary-edit").show();
    }

    else if ("not-loading")
    {
        //hide loading
        $("#loading-summary-edit").hide();
                    
        //show buttons
        $("#summary-edit-btn").show();
    }
}