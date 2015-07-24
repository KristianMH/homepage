$(document).ready(function () {
    function Add(){
        $("#tblData tbody").append(
            "<tr>"+
            "<td><input type='text'/></td>"+
            "<td><input type='text'/></td>"+
            "<td><img src='/trashcan_delete.ico' class='btnDelete'/>"+
            "<img src='/save.gif' class='btnSave'></td>"+
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
        var newTeam   = tdTeam.children().val();
        tdName.text(newName);
        tdEmail.text(newEmail);
        tdButtons.html("<img src='../trashcan_delete.ico' class='btnDelete'/>"+
                       "<img src='../edit.gif' class='btnEdit'/>");
        var payload = {
            name: newName,
            year: newYear,
            id : teamID,
        }
        if (teamID){
            $.ajax({
                url: "teams/updateteam",
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
                }
            });
        }
        $(".btnDelete").bind("click", Delete);
        $(".btnEdit").bind("click", Edit);
    };
    function Edit(){
        jQuery.extend({
            getValues: function(url) {
                var result = null;
                $.ajax({
                    url:url,
                    type : "GET",
                    contentType : "application/json",
                    processData : false,
                    async: false,
                    success: function(data) {
                        result = data;
                    }
                });
                return result;
            }
        });
        var teams = $.getValues("/teams")
        console.log(teams);
        var par = $(this).parent().parent(); //table row
        var tdName    = par.children("td:nth-child(1)");
        var tdEmail   = par.children("td:nth-child(2)");
        var tdTeam    = par.children("td:nth-child(3)");
        var tdButtons = par.children("td:nth-child(4)");
        tdName.html("<input type='text' id='txtName' value='"+tdName.text()+"'/>");
        tdEmail.html("<input type='text' id='txtEmail' value='"+tdEmail.text()+"'/>");
        // TODO: Make option to select Team from dropdown, make function that gets team list?
        tdTeam.html("<select id='teamSelect'></select>");
        var list = teams.results;
        $.each(list,function (i, item) {
            $("#teamSelect").append($("<option>", {
                value: item.team_id,
                text : item.teamname +" "+item.year
            }));
        });
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
