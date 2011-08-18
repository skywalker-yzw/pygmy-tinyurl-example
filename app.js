/**
 * Pygmy Application
 */

var express = require('express')
  , redis = require('redis').createClient()
  , shrinkray = require('./shrinkray.js')
  ;

// Test out our ShrinkRay
var randomKey = shrinkray.generateKey(10);
console.log('Generating a random 10 digit key ' + randomKey);

// Initialize the Express App
var app = module.exports = express.createServer();

// Configuration
redis.set('CurrentServerVersion', '1.0.0.' + new Date().getTime());
var Root = '';

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Environments
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  Root = 'http://localhost:3000/';
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  Root = 'http://pygmy/';
});

// Save the current server root
redis.set('CurrentServerRoot', Root);

// Routes
app.get('/', function(req, res){
  res.render('index', {
    serverDate: new Date()
  });
});

// ----BLL---
var getByKey = function(key, error, success) {
  redis.get(key, function(err, data) {
    if(!data) {
      if(error) {
        error();
      }
      return;
    }
    
    var url = data.toString();
    console.log('Found ' + key + ' with a value of ' + url);
    success(key, url);
  });
}

// Confirmation Page
app.get('/confirm/:id', function(req, res){
  getByKey(req.params.id
    // on error
    , function(){ 
      res.writeHead( 404 );
      res.write('Can\'t find anything');
      res.end();
    }
    // on success
    , function(key, url) {
    res.render('confirm', {
        key: key
      , url: url
      , src: Root
    });
  })
});

// Save New
app.post('/new', function(req, res) {
  var url = req.body.uri
    , key = shrinkray.generateKey(10)
    ;
  redis.set(key, url);
  res.redirect('/confirm/' + key);
});

// Find Existing
app.get('/:id', function(req, res){
  getByKey(req.params.id
    // on error
    , function(){ 
      res.writeHead( 404 );
      res.write('Can\'t find anything');
      res.end();
    }
    // on success
    , function(key, url){
    console.log('Redirecting to... ' + url);
    res.redirect(url);
  })
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
