var express = require('express');
var session = require("client-sessions");
var router = express.Router();
var pg = require("pg");
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

router.post("/", function (req,res){
    pg.connect(process.env.DATABASE_URL+"?ssl=true", function(err, client, done){
        if (err) throw err;
        client.query("SELECT * from admin where email=$1",[req.body.email],
                     function(err,result){
                         done();
                         if (err) res.send("forkert login");
                         if (encrypt(req.body.password) == result.rows[0].password){
                             var sess= req.loginSession;
                             sess.email = req.body.email;
                             sess.loggedIn = 1;
                             sess.admin=1;
                             sess.username=result.rows[0].name;
                             res.redirect("/teams/view")
                         } else {
                             res.send("forkert login");
                         }
                     });
    });
    
});

router.get("/logout", function (req,res) {
    req.loginSession.reset();
    res.redirect("/");
    
})
module.exports = router;
