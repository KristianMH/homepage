var express = require('express');
var app = express();
var requireDir = require("require-dir");
var routes = requireDir("routes");
var bodyParser= require("body-parser");
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var pg = require("pg");
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL+'?ssl=true', function(err, client, done) {
      if (err){
          console.log(err);
          response.send("Error " + err);
      }
    client.query('SELECT * FROM users', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
})

app.get('/', function(request, response) {
  response.render('pages/index', {title :"Testing something"});
});
app.use("/users",routes.users);
app.use("/about",routes.about);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


