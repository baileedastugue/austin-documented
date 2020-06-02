$(document).ready(() => {
    
//     console.log(window.location.href);

    $("a#scrape").on("click", function() {
        postArticles();
        setTimeout(function () {
            if(window.location.hash != '#r') {
                window.location.hash = 'r';
                window.location.reload(1);
            }
        }, 2000);
    })

    var postArticles = () => {
        $.getJSON("/articles", data => {
            for (let i = 0; i < data.length; i++) {
                var articleId = data[i]._id;
                $("#articles ul").append(`
                    <li>
                        <div class="card article-card"> 
                                <a href="${data[i].link}" target="_blank">${data[i].title}</a>
                                <img src="${data[i].img}" class="img-thumbnail m-auto">
                            <p class="card-text">
                                ${data[i].summary} <br>
                                Source: ${data[i].source}<br>
                                <span class="add-comment" data-id="${data[i]._id}" data-toggle="modal" data-target="#exampleModal">
                                    Comment
                                </span> / 
                                <span class="toggle-comments" state="hidden" data-id="${data[i]._id}">View Comments</span>
                                <div class="comments-container" data-id="${data[i]._id}"></div>
                            </p>
                        </div>
                    </li>`);
                $(".comments-container").hide()
            } 
        })
    }
    
    postArticles();

    $(document).on("click", "span.add-comment", function() {
        var articleId = $(this).attr("data-id");
        // console.log(articleId);
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).then(data => {
            // console.log(data);
            $('#myModal').modal('show');
            $(".modal-title").empty();
            $(".modal-title").append(`<p>${data[0].title}</p>`);
            $("div.modal-body").empty();
            $("div.modal-body").append(`
                <form>
                    <textarea id="bodyinput" name="body" placeholder="Add a comment" ></textarea>
                    
                    <button type="submit" class="btn submit-btn btn-primary">Post</button>
                </form>`
                );
            $("div.modal-footer").empty();
            $("div.modal-footer").append(`
                <span class="view-comments" state="hidden" data-id="${data[0]._id}">View Comments</span><br>
                `);
            $("div.modal-footer").append(`<br>
                <div class="view-container" data-id="${data[0]._id}"></div>
                `)
            $("div.modal-body").append(``);
            $(".submit-btn").attr("data-id", data[0]._id);
        })
    })

    $(document).on("click", ".submit-btn", function() {
        var articleId = $(this).attr("data-id");
        // console.log("you tired bitch")
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: $("#bodyinput").val()
            }
        })
        .then(data => {
            // console.log(data);
        $('#myModal').modal("hide");
        // $("textarea #bodyinput").val("");
        })
    })

    $(document).on("click", "span.view-comments", function() {
        var articleId = $(this).attr("data-id");
        var thisContainer = ".view-container[data-id=" + articleId +"]"; 
        // console.log(articleId);
        if ($(this).attr("state") === "hidden") {
            $(this).attr("state", "shown");
            $(thisContainer).show();
            $(thisContainer).empty();
            // $(thisContainer).css("display", "block");
            $(this).text("Hide Comments");
            $.ajax({
                method: "GET",
                url: "/articles/" + articleId
            }).then(data => {
                if (data[0].comment.length === 0) {
                    $(thisContainer).append(`<div class="card"> 
                        <div class="card-body">
                            <div class="card-text">
                                No comments posted yet!
                            </div>
                        </div>    
                    </div>`)
                } else {
                    $(thisContainer).empty();
                    for (let i = 0; i < data[0].comment.length; i++) {
                        let commentArray = data[0].comment;
                        
                        $(thisContainer).append(`<div class="card"> 
                            <div class="card-body">
                                <div class="card-text">
                                    ${commentArray[i].body}
                                </div>
                            </div>    
                        </div>`)
                    }
                }
            })
        }
        else {
            $(this).attr("state", "hidden");
            // console.log("hiding comments");
            $(this).text("View Comments");
            $(thisContainer).hide();
        }
    })

//     $(document).on("click", ".toggle-comments", function() {
//         var articleId = $(this).attr("data-id");
//         var thisContainer = ".comments-container[data-id=" + articleId +"]"; 
//         console.log(articleId);
//         if ($(this).attr("state") === "hidden") {
//             $(this).attr("state", "shown");
//             $(thisContainer).show();
//             $(thisContainer).empty();
//             // $(thisContainer).css("display", "block");
//             $(this).text("Hide Comments");
//             $.ajax({
//                 method: "GET",
//                 url: "/articles/" + articleId
//             }).then(data => {
//                 console.log(thisContainer);
//                 for (let i = 0; i < data[0].comment.length; i++) {
//                     let commentArray = data[0].comment;
                    
//                     $(thisContainer).append(`<div class="card"> 
//                         <div class="card-body">
//                             <div class="card-text">
//                                 ${commentArray[i].body}
//                             </div>
//                         </div>    
//                     </div>`)
//                     console.log(commentArray[i].body);
//                 }
//             })
//         }
//         else {
//             $(this).attr("state", "hidden");
//             console.log("hiding comments");
//             $(this).text("View Comments");
//             $(thisContainer).hide();
//         }
//     })


})