$(document).ready(function () {
    $('#admin-login').click(function () {
        var payload = {
            email: $("#login-email").val(),
            password:$("#login-password").val()
        };
        
        $.ajax({
            url: "/login",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                alert(data.responseText);
            }
        });
    });
});
