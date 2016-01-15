/*
author: pace_zhong@foxmail.com
desc: 数据库模块，提供封装后的数据库操作方法
*/
var root=process.cwd();
var mongodb = require('mongodb').MongoClient;
var dbAddress="mongodb://localhost:27017/srm";
var logger = require(root+'/modules/pana-log4js');

module.exports = {
  mongoClient: mongodb,
  getCollection: function(options){
    /*
      获取collection,db,用于后续操作
      collectionNamee: collectionNamee, 集合名
      success: fn(collection,db)成功回调
      error: fn(err) 错误回调
    */
    this.mongoClient.connect(dbAddress,{
      server:  {auto_reconnect: true}
    },function(err,db){
      if(err){
        logger.error(err)
        logger.error("db content error")
        if(typeof options.error==="function") options.error(err);
      }
      if (typeof options.success==="function") options.success(db.collection(options.collectionName),db);
    })
  },
  inDB:function(options){
    /*
      查询数据库表中是否已存在相同值
      collectionName: collectionName, 集合名
      queryParam: queryParam, 查询条件
      queryOptions: queryOptions, 查询选项
      result: fn(boolean,item),// 查询结果，布尔变量,匹配的第一条记录
    */
    this.query({
      collectionName: options.collectionName,
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
      collectionName: collectionName, 集合名
      queryOptions: queryOptions, 查询选项
      queryParam: queryParam, 查询条件
      success: fn(arr,result),// arr：数据结构的查询结果， result： 原始查询结果
    */
    var that=this;
    that.getCollection({
      collectionName: options.collectionName,
      success: function(collection,db){
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
    });
  },
  insert:function(options){
    /*
      数据库插入操作
      collectionNamee: collectionNamee, 集合名
      success: fn(result)成功回调
      error: fn(err,result), 出错回调
      data: {key:value...},// 查询结果，布尔变量。
    */
    var that=this,
        success=options.success,
        error=options.error;

    that.getCollection({
      collectionName: options.collectionName,
      success: function(collection,db){
        collection.insert(options.data,{safe:true},function(err, result){
          if(!err){
            if(typeof success==="function"){
              success(result);
            }
          }else{
            if(typeof error==="function"){
              logger.error(err)
              logger.error("db insert error")
              error(err,result);
            }
          }
          db.close();
        });
      }
    });
  },
  update: function(options){
    /*
      数据库插入操作
      collectionNamee: collectionNamee, 集合名
      selector: object 查询条件
      data: object, 更新的数据
      success: fn(item) 更新成功后回调，参数为更新后的数据，需要check item是否更新成功
    */
    var that=this;
    that.getCollection({
      collectionName: options.collectionName,
      success: function(collection,db){
        collection.updateOne(options.selector,options.data,{upsert:true}).then(function(result){
          collection.findOne(options.selector).then(function(item) {
            db.close();
            if(typeof options.success=="function") options.success(item);
          });
        });
      }
    });
  }
};
