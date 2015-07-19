$(document).ready(function () {
    $('#admin-submit').click(function () {
        var payload = {
            name: $('#admin-name').val(),
            email: $("#admin-email").val(),
            password:$("#admin-password").val()
        };
        
        $.ajax({
            url: "/users/admin",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                $("#output").html("<p>"+payload.name+" blev tilføjet til admin-databasen");
            }
        });
    });
});
