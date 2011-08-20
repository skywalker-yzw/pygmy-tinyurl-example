
exports.MainController = function(redis, shrinkray, config){
    
  // Private Methods
  var _getByKey = function(key, error, success) {
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
  
  var _404 = function(){ 
    res.writeHead( 404 );
    res.write('Can\'t find anything');
    res.end();
  };
  
  // Actions Below
  var return = { 
    
    Index: function(req, res){
      res.render('index', {
        serverDate: new Date()
      });
      
    } // Index
  
    ,
    
    Confirm: function(req, res){
      _getByKey(req.params.id
        , _404
        // on success
        , function(key, url) {
        res.render('confirm', { key: key, url: url, src: config.Root });
      })
      
    } // Confirm
    
    ,
    
    New: function(req, res) {
      var url = req.body.uri
        , idKey = '_lastIdUsed';
  
      var populateKey = function(err,data){
        var id = 0;
    
        if(data) {
          id = Number(data) + 1;
        }
    
        redis.set(idKey, id);
    
        console.log('Next ID is : ' + id);
    
        key = shrinkray.base64encode(id);
    
        console.log('Key is: ' + key);
    
        redis.set(key, url);
        res.redirect('/confirm/' + key);
    
      };
      
      redis.get(idKey, populateKey);
    } // New
  
    ,
    
    Show: function(req, res){
      getByKey(req.params.id
        , _404
        // on success
        , function(key, url){
          console.log('Redirecting to... ' + url);
          res.redirect(url);
        })
    } // Show
  
  } // MainControllerModule
  
}; // MainController