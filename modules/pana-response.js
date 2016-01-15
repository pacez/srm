/*
author: pace_zhong@foxmail.com
desc: 重新封装的response方法，更便捷的提供响应，保证返回数据结构的一致性。
*/

var root=process.cwd();
var tools=require(root+"/modules/pana-tools");
var logger=require(root+"/modules/pana-log4js");

var response=function(res){
  this.res=res;
};

response.prototype.error=function(data){
  res=this.res;
  var errorData={success:false};

  if(data){
    //判断数据库错误类型
    if(data.name=="MongoError"){
      errorData.errorMsg=data.message;
      errorData.source="DB";
    }else {
      errorData.source="normal";
      errorData=tools.mergeJson(errorData,data);
    }
  }


  res.json(errorData);
};

response.prototype.success=function(data){
  res=this.res;
  var data={
    success: true,
    result: data
  };
  res.json(data);
};

response.prototype.redirect=function(url){
  this.res.redirect(url);
};

module.exports = response
