var express = require('express');
var router = express.Router();
var pg = require("pg");
/* GET about page. */
router.post('/', function(req, res, next) {
    var data = {name:req.body.name, email:req.body.email};
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function(err, client, done){
        if (err) throw err;
        client.query("INSERT INTO users(NAME,EMAIL) VALUES($1,$2)",
                     [data.name, data.email], function(err, result){
                         if (err) throw err;
                         res.send(data.name+" blev tilføjet til databasen");
                     });
    });
});

module.exports = router;
