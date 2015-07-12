var express = require('express');
var router = express.Router();
var pg = require("pg");

router.post('/', function(req, res, next) {
    var data = {name:req.body.name, email:req.body.email};
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function(err, client, done){
        if (err) throw err;
        client.query("INSERT INTO users(NAME,EMAIL) VALUES($1,$2)",
                     [data.name, data.email], function(err, result){
                         if (err) throw err;
                     });
        client.query("SELECT * from USERS", function(err, result){
            done();
            if (err) throw err;
            res.send({results:result.rows});
        })
    });
});
router.get("/remove/:id", function(req, res, next){
    var data = {id:req.params.id};
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function(err, client, done){
        if (err) throw err;
        client.query("DELETE FROM users WHERE id = $1",[data.id], function(err, result){
            done();
            if(err) throw err;
            res.send("");
        });
    });
});
module.exports = router;
