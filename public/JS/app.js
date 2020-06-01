$(document).ready(() => {
    


    $.getJSON("/articles", data => {
        // console.log(data);
        
        for (let i = 0; i < data.length; i++) {
            
            var articleId = data[i]._id;
            // console.log(articleId);
           
            $("#articles").append(`
                <div style="display: inline-flex;" class="card w-25" > 
                <div class="card-header">
                    <a href="${data[i].link}" target="_blank">${data[i].title}</a>
                </div>
                <p class="card-text">
                    <img src="${data[i].img}" class="img-thumbnail rounded">
                    ${data[i].summary} <br>
                    Source: ${data[i].source}<br>
                    <span class="add-comment" data-id="${data[i]._id}" data-toggle="modal" data-target="#exampleModal">Comment</span> / 
                
                    <span class="toggle-comments" state="hidden" data-id="${data[i]._id}">View Comments</span>
                    <div class="comments-container" data-id="${data[i]._id}"></div>
                </p>
            </div>`);
            $(".comments-container").hide()
            // $.ajax({
            //     method: "GET",
            //     url: "/articles/" + articleId
            // }).then(comments => {
            //     for (let i = 0; i < comments[0].comment.length; i++) {
            //         let commentArray = comments[0].comment;
            //         $(".comments-container").append(commentArray[i].body);
            //         console.log(commentArray[i].body);
            //     }
            // })
            // console.log("hi from line 39");
        }
    })

    $(document).on("click", "span.add-comment", function() {
        var articleId = $(this).attr("data-id");
        console.log(articleId);
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).then(data => {
            console.log(data);
            $('#myModal').modal('show');
            $(".modal-title").empty();
            $(".modal-title").append(`<p>${data[0].title}</p>`);
            $("div.modal-body").empty();
            $("div.modal-body").append(`<h6>Comment:</h6><br>
                    <textarea id="bodyinput" name="body"></textarea>`
                );
            $("div.modal-footer").empty();
            $("div.modal-footer").append(`
                <span class="toggle-comments" data-id="${data[0]._id}">View Comments</span>`)
            $("div.modal-body").append(`<button type="submit" class="btn submit-btn btn-primary">Post</button>`);
        
            $(".submit-btn").attr("data-id", data[0]._id);

        })
    })

    $(document).on("click", ".submit-btn", function() {
        var articleId = $(this).attr("data-id");
        console.log("you tired bitch")
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: $("#bodyinput").val()
            }
        })
        .then(data => {
            console.log(data);
        $('#myModal').modal("hide");
        location.reload(true);
        // $("textarea #bodyinput").val("");
        })
    })

    $(document).on("click", "span.view-comments", function() {
        $("div.modal-body").empty();
        var articleId = $(this).attr("data-id");
        console.log("hello from line 61");
        console.log(articleId);
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).then(data => {
            for (let i = 0; i < data[0].comment.length; i++) {
                let commentArray = data[0].comment;
                console.log(commentArray[i].body);
            }
            // console.log(data[0].comment[0].body);
            $('#myModal').modal('show');

        })
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
                console.log(thisContainer);
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