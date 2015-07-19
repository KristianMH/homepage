$(document).ready(function () {
    $('#new-user-submit').click(function () {
        var payload = {
            name: $('#user-name').val(),
            email: $("#user-email").val()
        };
        
        $.ajax({
            url: "/users",
            type: "POST",
            contentType: "application/json",
            processData: false,
            data: JSON.stringify(payload),
            complete: function (data) {
                var arr = $.map(data.responseJSON, function(el) { return el; });
                $("tbody").empty();
                for (var i=0; i < arr.length; i++) {
                    var row = arr[i];
                    $("#usersTable tbody").append('<tr><td>'+row.name+'</td><td>'+row.email+
                                      '</td><td><a href="#" id="'+row.id+
                                      '" class="removeUserLink">X</a></td></tr>"')
                }
                $("#output").html("<p>"+payload.name+" blev tilføjet til databasen");
            }
        });
    });
});
