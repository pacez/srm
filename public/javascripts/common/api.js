/*
* author: pace_zhong@foxmail.com
* desc: 统一管理api接口
* dependencies： jquery
*/

(function(window,$){

  //防止重复加载
  if(window.api){
    return;
  }

  //暴露给全局使用
  api=window.api={};

  api.url={
    run: '/srm/workspace/run',
    login: '/srm/api/login'
  };

  api.ajaxQueue={};

  api.ajax=function(type,options){
    var that=this,
        abort=options.abort,
        url=options.url,
        data=options.data,
        success=options.success,
        error=options.error,
        ajaxName="ajax_"+new Date().getTime();

    if(url){
      if(abort){
        for(var i in that.ajaxQueue){
          var item=that.ajaxQueue[i];
          if(url===item.url){
            item.xhr.abort();
            delete item;
          }
        }
      }

      var xhr=$.ajax({
          type: type,
          url: url,
          async: (typeof options.async==="undefined" ? true : options.async),
          timeout: 30000,
          data: data ? data : {},
          success: function(data){
            if(api.ajaxQueue[ajaxName]){
              delete api.ajaxQueue[ajaxName];
            }
            if(data.success){
              if(typeof success === "function"){
                success(data);
              }
            }else{
              if(typeof error === "function"){
                error(data);
              }
            }
          },
          error: function(data){
            if(api.ajaxQueue[ajaxName]){
              delete api.ajaxQueue[ajaxName];
            }
            if(typeof error === "function"){
              error({
                success: false,
                errorMsg: "网络错误！",
                result: {}
              });
            }
          }
        });

      if(abort){
        that.ajaxQueue[ajaxName]={
          xhr: xhr,
          url: options.url
        };
      }
    }

  };

  api.post=function(options){
    return this.ajax("POST",options);
  };

  api.get=function(options){
    return this.ajax("GET",options)
  };


})(window,jQuery)
