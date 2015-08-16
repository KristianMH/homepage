/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');
var router = express.Router();
var pg = require("pg");
var crypto = require("crypto"),
algorithm = "aes-256-ctr",
password = "d6F3Efeq";

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}
router.post('/', function(req, res, next) {
    var data = {
        name: req.body.name,
        email: req.body.email,
        teamid: req.body.teamid
    };
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
        if (err) throw err;
        client.query("INSERT INTO users(NAME,EMAIL,teamid) VALUES($1,$2,$3)", [data.name, data.email, data.teamid], function(err, result) {
            if (err) throw err;
        });
        client.query("SELECT * from USERS ORDER BY id", function(err, result) {
            done();
            if (err) throw err;
            res.send({
                results: result.rows
            });
        })
    });
});
router.get("/remove/:id", function(req, res, next) {
    var data = {
        id: req.params.id
    };
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
        if (err) throw err;
        client.query("DELETE FROM users WHERE id = $1", [data.id], function(err, result) {
            done();
            if (err) throw err;
            res.send("");
        });
    });
});
router.post("/admin", function(req, res) {
    var data = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    };
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
        if (err) throw err;
        client.query("INSERT INTO admin(name,email,password) VALUES($1,$2,$3)", [data.name, data.email, encrypt(data.password)], function(err, result) {
            if (err) throw err;
            res.send("");
        });
    });
});
router.post("/updateUser", function(req, res) {
    var data = {
        email: req.body.email,
        name: req.body.name,
        id: req.body.id,
        teamid: req.body.teamid
    };
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
        if (err) throw err;
        client.query("UPDATE users SET name=$1, email=$2, teamid=$3 WHERE id=$4", [data.name, data.email, data.teamid, data.id], function(err, result) {
            if (err) throw err;
            res.send("");
        })
    })
});
//Currently only gets progress for the user. 
router.get("/view/:id", function(req, res) {
    var id = req.params.id;
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
        var sql = "select * from tasks left outer join progress on" +
            " progress.user_id = tasks.task_id AND progress.user_id = $1;"
        var progress;
        client.query(sql, [id], function(err, result) {
            if (err) throw err;
            progress = result.rows;
        });
        var userInfo;
        client.query("SELECT * from users where ID=$1",[id],function (err, result) {
            if (err) throw err;
            userInfo = result.rows[0];
        })
        client.query("select * from tasks", function(err, result) {
            done();
            if (err) throw err;
            res.render("pages/user.ejs", {
                tasks: result.rows,
                progress: progress,
                user: userInfo
            });
        });
    });
});
/*
 * Gets the progress for a user
 */
router.get("/progress/:id", function(req, res) {
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function(err, client, done) {
        var progress;
        client.query("select COUNT (*) from (users inner join progress on users.id=progress.user_id) inner join teams on users.teamid=teams.team_id where users.teamid=$1", [req.params.id], function(err, result) {
            if (err) throw err;
            progress = result.rows[0].count;
            res.send(progress);
        })

    })
})
module.exports = router;
