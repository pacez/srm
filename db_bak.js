/*
author: pace_zhong@foxmail.com
desc: 数据库模块，提供封装后的数据库操作方法
*/
var root=process.cwd();
var mongodb = require('mongodb');
var server  = new mongodb.Server('localhost', '27017', {auto_reconnect:true});
var db = new mongodb.Db('srm', server, {safe:true});
var logger = require(root+'/modules/pana-log4js');

module.exports = {
  inDB:function(options){
    /*
      查询数据库表中是否已存在相同值
      queryParam: queryParam, 查询字段
      queryOptions: queryOptions, 查询选项
      collection: str,集合名
      result: fn(boolean),// 查询结果，布尔变量。
    */
    var queryParam=options.queryParam,
        collection=options.collection;
    this.query({
      collection: collection,
      queryParam: options.queryParam ? options.queryParam : {},
      queryOptions: options.queryOptions ? options.queryOptions : {},
      success: function(arr,result){
        options.result(arr.length>0,arr[0]);
      }
    });
  },
  query: function(options){
    /*
      数据库查询
      queryParam: queryParam, 查询字段
      queryOptions: queryOptions, 查询选项
      collection: str,集合名
      success: fn(arr,result),// arr：数据结构的查询结果， result： 原始查询结果
    */
    var that=this;
    that.open(function(db){
      that.createCollection({
        db: db,
        collection: options.collection,
        success: function(collection){
          collection.find(options.queryParam,options.queryOptions,options,function(err,result){
            if(err){
              logger.error(err);
              logger.error("db find error")
              return;
            }
            result.toArray(function(err,arr){
                if(err){
                  logger.error(err)
                  logger.error("db data to array error")
                  return;
                }
                if(typeof options.success==="function"){
                  options.success(arr,result);
                }
            });
          });
        }
      })
    });
  },
  insert:function(options){
    /*
      数据库插入操作
      success: fn(result)成功回调
      error: fn(err,result), 出错回调
      table: table,表名
      data: {key:value...},// 查询结果，布尔变量。
    */
    var that=this,
        success=options.success,
        error=options.error;
    that.open(function(db){
      that.createCollection({
        db: db,
        collection: options.collection,
        success: function(collection){
          collection.insert(options.data,{safe:true},function(err, result){
            if(!err){
              if(typeof success==="function"){
                success(result);
              }
            }else{
              if(typeof error==="function"){
                logger.log(err)
                logger.log("db insert error")
                error(err,result);
              }
            }
            db.close();
          });
        }
      })
    });
  },
  open: function(success){
    db.open(function(err,db){
        if(err){
          logger.error(err);
          logger.error("db open error");
          return;
        }
        if(typeof success==="function") success(db);
    })
  },
  createCollection: function(options){
    options.db.createCollection(options.collection, {safe:true}, function(err, collection){
      if(err){
        logger.error(err)
        logger.error("db createCollection error")
        return;
      }
      if(typeof options.success=="function") options.success(collection);
    });
  },
  update: function(options){
    var that=this;
    that.open(function(db){
      that.createCollection({
        db: db,
        collection: options.collection,
        success: function(collection){
          collection.updateOne(options.selector,options.data,{upsert:true}).then(function(result){
            collection.findOne(options.selector).then(function(item) {
              if(typeof options.success=="function") options.success(item);
            });
          });
        }
      })
    })
  }
};
