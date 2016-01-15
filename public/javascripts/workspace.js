//获取地址栏参数
function getQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

//消息通知,仅用于refresh通知
function message(str){
  this.create=function(){
    $("body").append('<div id="message" class="message blue">'+str+'</div>');
  };
  this.destory=function(){
    $("#message").remove();
  };
}

//计算codeMirror高度
function getHeight($dom,isSetHeight){
  var offset=$dom.offset(),
      top=offset.top;
      if(isSetHeight){
        var setHeight=($(window).height()-top)/1.5;
      }else{
        var setHeight=($(window).height()-top);
      }
  return setHeight;
}

$(function(){
  //实例化源码编辑器，codeEditor基于codeMirror二次封装 ，集成高度自适应功能。
  var htmlEditor=new codeEditor({id: "htmlEditorTextarea",isSetHeight: true});
  //实例化邮件模板html编辑器，仅用于显示
  var htmlParseResultEditor=new codeEditor({id: "htmlParseResult"});
  //设置预览页面高度
  $(".htmlPreview").height($("#left").height());
  var urlId=$("#urlId").val();

  //调用后端run接口
  var run=function(){
    var htmlContent=htmlEditor.getValue();
    if(!$.trim(htmlContent)){
      return;
    }
    var msg=new message("refresh...");
    msg.create();
    //api是笔者封装的api方式，集成统一的消息处理机制，统一路径管理等功能。
    api.post({
      url: api.url.run,
      abort: true,
      data: {
        code: htmlContent,
        urlId: urlId
      },
      success: function(data){
        var queryId=getQueryString("id")
        if(!queryId){
          //在新页面，执行run时，刷新页面带上urlId;
          window.location.href="/workspace?id="+urlId;
        }else{
          //window.location.reload();
          //在已有id的页面，执行run时，仅异步刷新预览界面与邮件模板html编辑器，
          $("#previewIframe").attr("src","/workspace/preview?id="+urlId);
          htmlParseResultEditor.setValue(data.result.parsedCodeStr);
        }
        msg.destory();
      },
      error: function(data){
        //console.log(data)
        msg.destory();
      }
    })
  }


  //ctrl+s保存
  $("#htmlEditor").on("keydown.workspace",function(e){
    if((e.metaKey && e.keyCode===83) || (e.ctrlKey && e.keyCode===83)){
      e.preventDefault()
      e.stopPropagation()
      run();
    }
  });


  //运行按钮邦定运行方式
  $("#runBtn").on("click.workspace",function(){
    run();
  });

  //窗口缩放，自适应高度
  $(window).resize(function(){
    $htmlEditor=$("#htmlEditor")
    $htmlEditor.height(getHeight($htmlEditor,true));
    htmlEditor.refresh();
    $htmlParseResultEditor=$("#parseResult")
    $htmlParseResultEditor.height(getHeight($htmlParseResultEditor));
    htmlParseResultEditor.refresh();
    $(".htmlPreview").height($("#left").height());
  })

})
