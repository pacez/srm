var https = require('https');

var communicator=function(){
  this.https=https;
};
communicator.prototype.get=function(url,callback){
  https.get(url, function(res) {
    res.on('data', function(d) {
      callback(JSON.parse(d.toString()));
    });
  }).on('error', function(e) {
    console.error(e);
  });
};

module.exports=communicator;
