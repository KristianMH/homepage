var express = require("express");
var router = express.Router();
var pg = require("pg");

/*
 * inserts new team into the team database.
 */
router.post("/", function (req, res, next) {
    var data = {name:req.body.name, year: req.body.year};
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function (err, client, done) {
        if (err) throw err;
        client.query("INSERT INTO teams(name,year) VALUES ($1,$2)",
                     [data.name,data.year], function (err,result) {
                         if (err) {
                             throw err;
                             res.send("Holdet eksisterer allerede")
                         }
                         done();
                         // dont know if something should be sent back???
                     });
            });
});
/*
 * Gets the list of all teams.
 */
router.get("/", function (req, res) {
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function (err, client, done) {
        if (err) throw err;
        client.query("SELECT * FROM teams", function (err, result) {
            done();
            if (err) throw err;
            res.send({results: result.rows});
        });
    });
});

module.exports = router;
