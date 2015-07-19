$(document).ready(function () {
    $('#new-team-submit').click(function () {
        var payload = {
            name: $('#team-name').val(),
            year: $("#team-year").val()
        };
        
        $.ajax({
            url: "/teams",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $("#output").html("<p> Holdet "+payload.name+" blev tilføjet til hold-databasen");
            }
        });
    });
});
