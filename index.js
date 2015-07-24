/* global process */
/* global __dirname */
var express = require('express');
var app = express();
var requireDir = require("require-dir");
var routes = requireDir("routes");
var bodyParser = require("body-parser");
var session = require("client-sessions");
var helpers = require("express-helpers");
helpers(app);
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var pg = require("pg");
app.use(session({
    cookieName: "loginSession",
    secret: "someSecrectNoOneWillEverKnow",
    duration: 24 * 60 * 60 * 1000
}));
var sess = null;
app.get('/', function (request, response) {
    sess = request.loginSession;
    sess.email;
    if (!(sess.loggedIn == 1)) {
        sess.loggedIn = 0;
    }
    sess.admin;
    sess.username;
    response.render('pages/index', { title: "Testing something" });
});

// app.use with login should be placed before middleware-redirect if
// user not logged in

app.use("/login", routes.login);
app.use(function (req, res, next) {
    if (req.loginSession.loggedIn == 0) {
        res.redirect("/");
    } else {
        next();
    }
});
app.use("/users", routes.users);
app.use("/about", routes.about);

app.use("/teams", routes.teams);

app.get('/db', function (req, res) {
   pg.connect(process.env.DATABASE_URL+"?ssl=true", function(err, client, done){
    if (err) {
        console.log(err);
        res.send("Error " + err);
    }
    //client.query('SELECT * FROM users ORDER BY id', function(err, result) {
    client.query("select * from teams inner join users on teams.team_id = users.teamid order by users.id;",
        function (err, result) {
            done();
            if (err)
            { console.error(err); res.send("Error " + err); }
            else
            { res.render('pages/db', { results: result.rows }); }
        });
});
});
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


