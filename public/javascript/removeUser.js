$(document).ready(function () {
    $('.removeUserLink').click(function () {
        var id = this.id
        $.ajax({
            url: "/users/remove/"+id,
            type: "GET",
            contentType: "application/json",
            processData: false,
            complete: function (data) {
                $('#output').html("Brugeren med id: "+id+" blev fjernet fra databasen");
            }
        });
        $(this).parent().parent().remove();
    });
});
