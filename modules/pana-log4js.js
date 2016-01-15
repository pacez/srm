/*
author: pace_zhong@foxmail.com
desc: 对log4js进行二次封装，更符哈项目使用情况
*/

var root=process.cwd();
var pageConfig=require(root+"/pageConfig");
var log4js=require("log4js");

var logger=function(str,type){
  if(pageConfig.devMode){
    console.log("["+type+"]: "+str)
  }
}

log4js.configure({
  "appenders": [
    {
      "category": "log_debug",
      "type": "console"
    }, {
      "category": "log_info",
      "type": "file",
      "filename": "./logs/log_info/info.log",
      "maxLogSize": 104857500,
      "backups": 10
    }, {
      "category": "log_stat",
      "type": "file",
      "filename": "./logs/log_stat/stat"
    }, {
      "category": "log_trace",
      "type": "file",
      "filename": "./logs/log_trace/trace"
    }, {
      "category": "log_error",
      "type": "file",
      "filename": "./logs/log_error/error"

    }, {
      "category": "log_todo",
      "type": "file",
      "filename": "./logs/log_todo/todo"
    }
  ],
  "replaceConsole": false,
  "levels": {
    "log_info": "ALL",
    "log_stat": "ALL",
    "log_trace": "ALL",
    "log_error": "ALL",
    "log_todo": "ALL"
  }
});

var infoLogger=log4js.getLogger("log_info"),
    errorLogger=log4js.getLogger("log_error"),
    statLogger=log4js.getLogger("log_stat"),
    traceLogger=log4js.getLogger("log_trace"),
    todoLogger=log4js.getLogger("log_todo");

module.exports={
  info: function(str){
    logger(str,"DEBUG");
    infoLogger.info(str);
  },
  error: function(str){
    logger(str,"ERROR");
    errorLogger.error(str);
  },
  stat: function(str){
    logger(str,"STAT");
    statLogger.error(str);
  },
  trace: function(str){
    logger(str,"TRACE");
    traceLogger.error(str);
  },
  todo: function(str){
    logger(str,"TODO");
    todoLogger.error(str);
  }
};
