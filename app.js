/**
 * Pygmy Application
 */

var express = require('express')
  , redis = require('redis').createClient()
  , config = require('./modules/config.js')
  , shrinkray = require('./modules/shrinkray.js')
  , app = module.exports = express.createServer()
  , MainController = require('./controllers/maincontroller.js').MainController(redis, shrinkray, config)
  ;

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
  config.Root = 'http://localhost:3000/';
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  config.Root = 'http://pygmy/';
});

// Routes
app.get('/', MainController.Index);
app.get('/confirm/:id', MainController.Confirm);
app.post('/new', MainController.New);

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
