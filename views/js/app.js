// TODO: finish starred and notess
$(document).ready(function() {
    // save the id from the article--> get notes if there are any
    $(".leave-note").on("click", function() {
        var thisId = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .then(function(data) {
            console.log(data);


            if (data.note) {
                $("#note-input").val(data.note.body);
            }
        });
    });

    $("#save-note").on("click", function() {
        var thisId = $(this).attr("data-id");
        var bodyInput = $("#bodyinput").val();
        console.log("bodyInput",bodyInput);

        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                body: $("#bodyinput")
            }
        })
        .then(function(data) {
            console.log("data:", data);

        });

        $("#bodyinput").val("");

    });
});
