
exports.Config = function(app, express){
  
  return {
      Root: ''
    , init: function(){
      app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(__dirname + '/public'));
      });
    } // init
    
  } // return

}; // Config invocation