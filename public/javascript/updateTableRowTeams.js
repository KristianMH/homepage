$(document).ready(function () {
    function Add(){
        $("#teamsTbl tbody").append(
            "<tr>"+
            "<td><input type='text'/></td>"+
            "<td><input type='text'/></td>"+
            "<td></td>"+
            "<td><img src='../trashcan_delete.ico' class='btnDelete'/>"+
            "<img src='../save.gif' class='btnSave'></td>"+
            "</tr>");
        $(".btnSave").bind("click", Save);
	    $(".btnDelete").bind("click", Delete);
    }; 

    function Save() {
        var par = $(this).parent().parent(); // the table row.
        var tdName    = par.children("td:nth-child(1)");
        var tdyear   = par.children("td:nth-child(2)");
        var tdButtons = par.children("td:nth-child(4)");
        var teamID    = par.attr("id");
        var newName   = tdName.children().val();
        var newYear  = tdyear.children().val();
        tdName.text(newName);
        tdyear.text(newYear);
        tdButtons.html("<img src='../trashcan_delete.ico' class='btnDelete'/>"+
                       "<img src='../edit.gif' class='btnEdit'/>");
        var payload = {
            name: newName,
            year: newYear,
            id : teamID,
        }
        if (teamID){
            $.ajax({
                url: "/teams/updateTeam",
                type: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(payload),
                complete: function (data) {
                    $("output").html("<p> Holdet med ID: "+payload.id+" blev opdateret");
                }
            });
        } else {
            $.ajax({
                url: "/teams",
                type: "POST",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(payload),
                complete: function (data) {
                    $("#output").html("<p>"+payload.name+" blev tilføjet til databasen");
                    var newid = data.responseJSON[0].team_id;
                    par.attr("id",newid);
                    par.children("td:nth-child(3)").html("<a href=view/"+newid+">Se hold</a>");
                    tdButtons.html("<img src='../trashcan_delete.ico' class='btnDelete'/>"+
                       "<img src='../edit.gif' class='btnEdit'/>");
                }
            });
        }
        $(".btnDelete").bind("click", Delete);
        $(".btnEdit").bind("click", Edit);
    };
    function Edit(){
        var par = $(this).parent().parent(); //table row
        var tdName    = par.children("td:nth-child(1)");
        var tdyear    = par.children("td:nth-child(2)");
        var tdButtons = par.children("td:nth-child(4)");
        tdName.html("<input type='text' id='txtName' value='"+tdName.text()+"'/>");
        tdyear.html("<input type='text' id='txtyear' value='"+tdyear.text()+"'/>");
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
                url: "/teams/"+id,
                type: "DELETE",
                contentType: "application/json",
                processData: false,
                complete: function (data) {
                    $('#output').html("holdet med id: "+id+" blev fjernet fra databasen");
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
