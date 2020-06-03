$(document).ready(() => {
    $("a#scrape").on("click", function() {
        postArticles();
        setTimeout(function () {
            if(window.location.hash != '#r') {
                window.location.hash = 'r';
                window.location.reload(1);
            }
        }, 3000);
    })

    $(document).on("click", "span.add-comment", function() {
        var articleId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).then(data => {
            $('#myModal').modal('show');
            $(".modal-title").empty();
            $(".modal-title").append(`<p>${data[0].title}</p>`);
            $("div.modal-body").empty();
            $("div.modal-body").append(`
                <form>
                    <textarea id="bodyinput" name="body" placeholder="Add a comment" ></textarea>
                    
                    <button type="submit" class="btn submit-btn">Post</button>
                </form>`
                );
            $("div.modal-body").append(`
                <div class="row">
                    <div class="col-12">
                        <br>
                        <div class="view-comments" state="hidden" data-id="${data[0]._id}">View Comments</div><br>
                    
                        <div class="view-container" data-id="${data[0]._id}"></div>
                    </div>
                </div>`);
                
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

    $(document).on("click", "div.view-comments", function() {
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

    $(document).on("click", ".toggle-comments", function() {
        var articleId = $(this).attr("data-id");
        var thisContainer = ".comments-container[data-id=" + articleId +"]"; 
        console.log(articleId);
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
                    for (let i = 0; i < data[0].comment.length; i++) {
                        let commentArray = data[0].comment;
                        
                        $(thisContainer).append(`<div class="card"> 
                            <div class="card-body">
                                <div class="card-text">
                                    ${commentArray[i].body}
                                </div>
                            </div>    
                        </div>`)
                        console.log(commentArray[i].body);
                    }
                }
            })
        }
        else {
            $(this).attr("state", "hidden");
            console.log("hiding comments");
            $(this).text("View Comments");
            $(thisContainer).hide();
        }
    })


})