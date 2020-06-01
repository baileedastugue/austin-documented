$(document).ready(() => {
    console.log("banana");

    $.getJSON("/articles", data => {
        for (let i = 0; i < data.length; i++) {
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
                <span class="view-comments" data-id="${data[i]._id}">View comments</span>
                </p>
            </div>`);
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
            $(".submit-btn").attr("data-id", data[0]._id);

        })
    })

    $(document).on("click", ".submit-btn", function() {
        var articleId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: $("#bodyinput").val()
            }
        })
        .then(data => {
            console.log("data from line 51!!");
            console.log(data);

        });
        $('#myModal').modal("hide");
        $("textarea #bodyinput").val("");
    })
})