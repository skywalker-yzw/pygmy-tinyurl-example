/**
 * Pygmy Application
 */

var express = require('express')
  , app = module.exports = express.createServer()
  , redis = require('redis').createClient()
  , config = require('./config.js').Config(app, express)
  , shrinkray = require('./modules/shrinkray.js')
  , MainController = require('./controllers/maincontroller.js').MainController(redis, shrinkray, config)
  ;

// Initialize configuration
config.init();

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
app.get('/:id', MainController.Show);

// Start it up!
app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
