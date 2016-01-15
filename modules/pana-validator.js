/*
author: pace_zhong@foxmail.com
desc: 自定义校验器
*/
var root=process.cwd();
var db=require(root+"/modules/pana-db");
var tools=require(root+"/modules/pana-tools");

var validator=function(response){
  this.response=response;
}

validator.prototype.rules={
  required: function(value){
    return (value ? true : false)
  },
  zipCode: function(value){return /^[1-9][0-9]{5}$/.test(value) || !this.required(value)},
  email: function(value){ return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) || !this.required(value)},
  url: function(value){ return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value) || !this.required(value)},
  dateISO: function(value){ return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value) || !this.required($elem,value)},
  number: function(value){ return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) || !this.required($elem,value)},
  digits: function(value){ return /^\d+$/.test(value) || !this.required($elem,value)},
  idCard: function(value) { return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) || !this.required($elem,value)},
  minLength: function(value,len,dataType) {
    if(value===undefined) return false;
    var str=value;
    if(dataType==="array" && typeof value==="string"){
      str=[value];
    }
    return str.length >= len
  },
  maxLength: function(value,len,dataType) {
    if(value===undefined) return false;
    var str=value;
    if(dataType==="array" && typeof value==="string"){
      str=[value];
    }
    return str.length <= len
  },
  rangeLength: function(value,minLength,maxLength) {
    if(value===undefined) return false;
    var len=value.toString().length;
    return ((len >= minLength && len <= maxLength) || !this.required(value));
  },
  rangeDate:　function(start,end) { return parseInt(start,10) <= parseInt(end,10); },
  regExp: function(value,regExp) { return regExp.test(value)},
  compare: function(value,compareValue){
    return value===compareValue;
  }
}

validator.prototype.valid=function(value,ruleGroup){
  var that=this,
      response=that.response,
      rules=that.rules;

  for(var i=0; i<ruleGroup.length; i++){
    var rule=ruleGroup[i],
        name=rule.name,
        errorMsg=rule.errorMsg;

    //构建异步校验队列,绕过常规校验。
    if(that.asyncRulesQueue && name==="inDB"){
      rule.asyncValue=value;
      that.asyncRulesQueue.push(rule);
      continue;
    }
    switch (name) {
      case 'regExp':
        if(!rules[name](value,rule.regExp)){
          response.error({errorMsg: errorMsg});
          return false;
        }
        break;
      case 'compare':
        if(!rules[name](value,rule.compareValue)){
          response.error({errorMsg: errorMsg});
          return false;
        }
        break;
      case 'minLength':
      case 'maxLength':
        if(!rules[name](value,rule.length,rule.dataType)){
          response.error({errorMsg: errorMsg});
          return false;
        }
        break;
      case 'rangeDate':
        if(!rules[name](rule.start,rule.end)){
          response.error({errorMsg: errorMsg});
          return false;
        }
        break;
      default:
        if(!rules[name](value)){
          response.error({errorMsg: errorMsg});
          return false;
        }
    }
  }
  return true;
}

validator.prototype.validAll=function(options){
  var that=this,
      valid=that.valid,
      rules=options.rules,
      success=options.success;

  that.asyncRulesQueue=[];//初始化异步规则队列
  that.asyncRulesCount=0; //队列计数器
  for(var i=0; i<rules.length; i++){
    var item=rules[i],
        value=item.value,
        ruleGroup=item.rules;
    if(!valid.call(that,value,ruleGroup)){
      return false;
    }
  }
  if(typeof success==="function"){
    if(that.asyncRulesQueue.length===0){
      success();
    }else{
      var asyncRulesQueue=that.asyncRulesQueue,
          asyncRulesQueueLength=asyncRulesQueue.length;
          validAsync=that.validAsync;
      for(var i=0; i<asyncRulesQueueLength; i++){
        var asyncRule=asyncRulesQueue[i];
        validAsync.call(that,asyncRule,function(){
          that.asyncRulesCount+=1;
          if(asyncRulesQueueLength===that.asyncRulesCount) success();
        });
      }
    }
  }

  return true;
}

validator.prototype.validAsync=function(rule,callback){
    //callback是校验通过后的回调
    var response=this.response,
        name=rule.name,
        errorMsg=rule.errorMsg,
        value=rule.asyncValue;
    switch (name) {
      case 'inDB':
        var queryParam=rule.queryParam;
        db.inDB({
          queryParam: (rule.operator==="or" ? {"$or":tools.jsonToAarryJson(queryParam)} : queryParam),
          collectionName: rule.collectionName,
          result: function(boolean,userInfo){
            if(boolean){
            var errorMsg='',
                errorMsgGroup=rule.errorMsg;
              for(var i in queryParam){
                for(var o in userInfo){
                  if(i===o && queryParam[i]===userInfo[o]){
                    errorMsg+=errorMsgGroup[i]+'|';
                  }
                }
              }
              response.error({errorMsg:errorMsg.substring(0,errorMsg.length-1)});
              return false;
            }else {
              if(typeof callback==="function") callback();
              return true;
            }
          }
        });

        break;
      default:
        if(!rules[name](value)){
          response.error({errorMsg: errorMsg});
          return false;
        }else{
          if(typeof callback==="function") callback();
          return true;
        }
    }
}

module.exports=validator;
