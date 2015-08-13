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
app.use(bodyParser.urlencoded({
  extended: false
}));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var pg = require("pg");
app.use(session({
  cookieName: "loginSession",
  secret: "someSecrectNoOneWillEverKnow",
  duration: 2 * 60 * 60 * 1000
}));
var sess = null;
app.get('/', function(request, response) {
  sess = request.loginSession;
  sess.email;
  if (!(sess.loggedIn == 1)) {
    sess.loggedIn = 0;
  }
  sess.admin;
  sess.username;
  response.render('pages/index', {
    title: "Testing something"
  });
});

/**
 * app.use with login should be placed before middleware-redirect if
 * user not logged in
 **/ 
app.use("/login", routes.login);
// Chekcs if user is logged in if not redicerets request to front page else next middleware. 
app.use(function(req, res, next) {
  if (req.loginSession.loggedIn == 0) {
    res.redirect("/");
  } else {
    next();
  }
});
// user middleware
app.use("/users", routes.users);
// about middleware
app.use("/about", routes.about);
// team middleware. 
app.use("/teams", routes.teams);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
