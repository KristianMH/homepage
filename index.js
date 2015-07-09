var express = require('express');
var app = express();
var requireDir = require("require-dir");
var routes = requireDir("routes");
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', function(request, response) {
  response.render('pages/index', {title :"Testing something"});
});

app.use("/about",routes.about);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


