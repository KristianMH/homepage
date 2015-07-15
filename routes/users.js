var express = require('express');
var router = express.Router();
var pg = require("pg");
var crypto = require("crypto"),
    algorithm = "aes-256-ctr",
    password = "d6F3Efeq";

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
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
router.post("/admin", function(req,res){
    var data = {email:req.body.email, password: req.body.password, name: req.body.name};
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function(err, client, done){
        if (err) throw err;
        client.query("INSERT INTO admin(name,email,password) VALUES($1,$2,$3)",
                    [data.name,data.email,encrypt(data.password)], function(err, result){
                        if (err) throw err;
                        res.send("");
                    });
    });
});

module.exports = router;
