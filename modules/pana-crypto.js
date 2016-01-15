/*
author: pace_zhong@foxmail.com
desc: 加密模块简单封装 ，md5非对称
*/
var crypto = require('crypto');

var cipher=function(){
  this.sha1=new crypto.createHash('sha1');
}

cipher.prototype.encrypt=function(str){
  var sha1=this.sha1;
  sha1.update(str);
  return sha1.digest('hex');
}

module.exports=cipher;
