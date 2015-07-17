$(document).ready(function () {
    function Add(){
        $("#tblData tbody").append(
            "<tr>"+
            "<td><input type='text'/></td>"+
            "<td><input type='text'/></td>"+
            "<td><img src='../trashcan_delete.ico' class='btnDelete'/>"+
            "<img src='../save.gif' class='btnSave'></td>"+
            "</tr>");
        $(".btnSave").bind("click", Save);
	    $(".btnDelete").bind("click", Delete);
    }; 

    function Save() {
        var par = $(this).parent().parent(); // the table row.
        var tdName = par.children("td:nth-child(1)");
        var tdEmail = par.children("td:nth-child(2)");
        var tdButtons = par.children("td:nth-child(3)");
        var userID = par.attr("id"); // TODO: Find id of selected row, if no id => add new user should be added
        var newName = tdName.children().val();
        var newEmail = tdEmail.children().val();
        tdName.text(tdName.children().val());
        tdEmail.text(tdEmail.children().val());
        tdButtons.html("<img src='../trashcan_delete.ico' class='btnDelete'/>"+
                       "<img src='../edit.gif' class='btnEdit'/>");
        var payload = {
            name: newName,
            email: newEmail,
            id : userID
        }
        if (userID){
            $.ajax({
                url: "users/updateUser",
                type: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(payload),
                complete: function (data) {
                    $("output").html("<p> Brugeren med ID: "+payload.id+" blev opdateret");
                }
            });
        } else {
            $.ajax({
                url: "/Users",
                type: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(payload),
                complete: function (data) {
                    $("#output").html("<p>"+payload.name+" blev tilføjet til databasen");
                }
            });
        }
        $(".btnDelete").bind("click", Delete);
        $(".btnEdit").bind("click", Edit);
    };
    function Edit(){
        var par = $(this).parent().parent(); //table row
        var tdName = par.children("td:nth-child(1)");
        var tdEmail = par.children("td:nth-child(2)");
        var tdButtons = par.children("td:nth-child(3)");
        tdName.html("<input type='text' id='txtName' value='"+tdName.text()+"'/>");
        tdEmail.html("<input type='text' id='txtEmail' value='"+tdEmail.text()+"'/>");
        tdButtons.html("<img src='../trashcan_delete.ico' class='btnDelete'/>"+
                       "<img src='../save.gif' class='btnSave'/>");
        $(".btnSave").bind("click", Save);
        $(".btnDelete").bind("click", Delete);
    };
    function Delete(){
        var par = $(this).parent().parent();
        var id = par.attr("id");
        if (id) {
            $.ajax({
                url: "/users/remove/"+id,
                type: "GET",
                contentType: "application/json",
                processData: false,
                complete: function (data) {
                    $('#output').html("Brugeren med id: "+id+" blev fjernet fra databasen");
                    par.remove();
                }
            })
            } else {
                par.remove();
            }
    };
    
    $(function(){
        $(".btnEdit").bind("click",Edit);
        $(".btnDelete").bind("click", Delete);
        $("#btnAdd").bind("click",Add);
        console.log("hello");
    });
});
