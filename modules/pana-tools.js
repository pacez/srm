/*
author: pace_zhong@foxmail.com
desc: 核心模块，提供基础工具
*/

var panaTools={}

//合并json
panaTools.mergeJson=function(json1, json2){
  var result={};
  for(var attr in json1){
      result[attr]=json1[attr];
  }
  for(var attr in json2){
      result[attr]=json2[attr];
  }
  return result;
};

//{key:value,key:value}  -> [{key: value},{key: value}...]
panaTools.jsonToAarryJson=function(json){
  var arrJson=[];
  for(var i in json){
    var tempObject={};
    tempObject[i]=json[i]
    arrJson.push(tempObject);
  }
  return arrJson;
};

//格式化消息
panaTools.formatMsg=function(str){
	var args = Array.prototype.slice.apply(arguments, [1]);
  for(var i = 0, j = args.length; i < j; i++){
    str = str.replace("%s", args[i]);
  }
  return str;
};

//判断是否数组类型
panaTools.isArray=function(value){
  return value.constructor===Array;
};

//创建全局唯一标识
panaTools.createGUID=function(){
  function S4() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
};

//去除头尾空格
panaTools.trim=function(str) {
  return str.replace(/(^\s*)|(\s*$)/g,"");
};

module.exports=panaTools;
