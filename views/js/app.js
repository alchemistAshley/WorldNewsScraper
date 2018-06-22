// TODO: all the js
// require models?
// go to index "/" from load



$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        res.render("scraped", { scraped: data });
    }
});

// when someone clicks on star save --> saved & saved --> not / & leave note: get's notes and can create new note; ability to delete note
// $(".star").on("click", function() {
//     var thisId = $(this).attr("data-id");

//     $.ajax({
//         method: "GET",
//         url: "/articles/" + thisId
//     })
//     .then(function(data) {
//         console.log(data);

//         data.starred= true; 
//     }
// }); 

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
            $(".note-input").val(data.note.body);
        }
    });
});

$(".save-note").on("click", function() {
    var thisId = $(this).attr("data-id")

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body:  $("#bodyinput").val()
        }
    })
    .then(function(data) {
        console.log(data);

    });

    $("#bodyinput").val("");

});