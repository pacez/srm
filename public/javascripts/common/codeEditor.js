/*
auth: cdzhongpeizhi@jd.com
desc: 自适应满屏高度的代码编辑器，基于CodeMirror
useage: new codeEditor({id:id,mode:mode});
*/
(function(window,$){
  if(window.codeEditor){
    return;
  }
  var codeEditor=window.codeEditor=function(options){
    this.$dom=$("#"+options.id);
    this.init(options.mode,options.isSetHeight);
    return this.editor;
  };
  codeEditor.prototype.create=function(mode){
    var myTextarea = this.$dom[0];
    this.editor=CodeMirror.fromTextArea(myTextarea, {
        mode: mode ? mode :"htmlmixed",
        lineNumbers: true,
        theme: "night"
    });
  };
  codeEditor.prototype.setHeight=function(isSetHeight){
    var $htmlEditor=this.$dom.parent(),
        offset=$htmlEditor.offset(),
        top=offset.top;
        if(isSetHeight){
          var setHeight=($(window).height()-top)/1.5;
        }else{
          var setHeight=($(window).height()-top);
        }

    $htmlEditor.height(setHeight);
  };
  codeEditor.prototype.init=function(mode,isSetHeight){
    this.setHeight(isSetHeight);
    this.create(mode);
  };

})(window,jQuery);
