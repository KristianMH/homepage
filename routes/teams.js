var express = require("express");
var router = express.Router();
var pg = require("pg");

/*
 * inserts new team into the team database.
 */
router.post("/", function(req, res, next) {
  var data = {
    name: req.body.name,
    year: req.body.year
  };
  pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
    if (err) throw err;
    client.query("INSERT INTO teams(teamname,year) VALUES ($1,$2) returning team_id", [data.name, data.year], function(err, result) {
      if (err) {
        throw err;
        res.send("Holdet eksisterer allerede")
      }
      done();
      res.send(result.rows)
    });
  });
});
/*
 * updates team info
 */
router.post("/updateTeam", function(req, res) {
  var data = {
    name: req.body.name,
    year: req.body.year,
    id: req.body.id
  };
  pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
    if (err) throw err;
    client.query("UPDATE teams SET teamname=$1, year=$2 where team_id=$3", [data.name, data.year, data.id], function(err, result) {
      if (err) throw err;
      done();
    });
  });
});
/*
 * deletes a team
 */
router.delete("/:id", function(req, res) {
  pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
    if (err) throw err;
    client.query("DELETE FROM teams where team_id=$1", [req.params.id],
      function(err, result) {
        done();
        if (err) throw err;
        res.status(200).send("holdet med id:" + req.params.id + "blev slettet");
      });
  });
});
/*
 * Gets the list of all teams.
 */
router.get("/view", function(req, res) {
  pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
    if (err) throw err;
    client.query("SELECT * FROM teams order by team_id", function(err, result) {
      done();
      if (err) throw err;
      res.render("pages/teams", {
        results: result.rows
      });
    });
  });
});
/*
 * Get team info to view (all users)
 */
router.get("/view/:id", function(req, res) {
  pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
    if (err) throw err;
    var teamName;
    client.query("Select * from teams where team_id=$1", [req.params.id],
      function(err, result) {
        if (err) throw err;
        teamName = result.rows
      });
    client.query("select * from teams inner join users on users.teamid = teams.team_id" +
      " WHERE users.teamid = $1 order by users.id;", [req.params.id],
      function(err, result) {
        done();
        if (err) throw err;
        res.render("pages/team", {
          results: result.rows,
          teamName: teamName
        });
      });
  });
});

module.exports = router;
