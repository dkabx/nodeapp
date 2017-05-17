var express = require('express');
var app = express();
var routes = require('./src/routes.js');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use('/', routes);
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//
// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
