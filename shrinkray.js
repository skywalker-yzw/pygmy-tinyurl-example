function generateKey(length) {
  var junk = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz"
    , result = "";
  for(var i=0; i<length; i++) {
    var rand = Math.floor(Math.random() * junk.length);
    result += junk.substring(rand, rand+1);
  }
  
  return result;
}

module.exports.generateKey = generateKey;