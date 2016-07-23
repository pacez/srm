var express = require('express');
var router = express.Router();
var root=process.cwd();
var markdown = require( "markdown" ).markdown;
var fs = require( "fs" );
var pageConfig=require(root+'/pageConfig');
var db = require(root+'/modules/pana-db.js');
var tools = require(root+'/modules/pana-tools.js');
var response = require(root+'/modules/pana-response.js');
var jMailParse = require(root+'/modules/jMail-parse.js');


var menus=pageConfig.menus;


/* 工作平台渲染 */
router.get('', function(req, res, next) {
    var urlId=req.query.id;//获取地址上的id参数
    if(!urlId){
      //不带ID地址请求
      res.render('workspace', {
        pageConfig: pageConfig,
        code: '',
        urlId: tools.createGUID(),
        pageName: 'workspace'
      });
    }else{
      //请求带id,进行数据库查找
      db.inDB({
        collectionName: "workspace",
        queryParam: {
          urlId: urlId
        },
        result: function(boolean,result){
          if(boolean){
            //数据匹配成功，渲染页面
            var codeStr=result.code;
            jMailParse(codeStr,function(parsedCodeStr){
              res.render('workspace', {
                pageConfig: pageConfig,
                urlId: urlId,
                code: codeStr,
                parsedCodeStr: parsedCodeStr,
                pageName: 'workspace'
              });
            })
          }else{
            //数据库没有这个id,重定向到工作平台首页
            res.redirect('/srm/workspace')
          }
        }
      })
    }
});

/* 运行接口 */
router.post("/run",function(req,res,next){
  var postData=req.body,
      createResponse=new response(res);
  db.update({
    collectionName: 'workspace',
    selector: { "urlId": postData.urlId},
    data: postData,
    success: function(data){
      if(data && data.urlId==postData.urlId){
        jMailParse(data.code,function(parsedCodeStr){
          data.parsedCodeStr=parsedCodeStr;
          createResponse.success(data);
        })
        return;
      }
      createResponse.error({result: data});
    }
  })
});

/* 预览界面 */
router.get("/preview",function(req,res,next){
  var urlId=req.query.id;
  if(urlId){
    db.inDB({
      collectionName: "workspace",
      queryParam: {
        urlId: urlId
      },
      result: function(boolean,result){
        if(boolean){
          //数据匹配成功，渲染页面
          var codeStr=result.code;
          jMailParse(codeStr,function(htmlStr){
            res.render('preview', {
              htmlStr: htmlStr
            });
          });
        }else{
          res.render("preview",{
            htmlStr: ""
          })
        }
      }
    })
    return;
  }

  res.render("preview",{
    htmlStr: ""
  })
})


module.exports = router;
