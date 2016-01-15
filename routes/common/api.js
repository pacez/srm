var root=process.cwd();
var express = require('express');
var tools = require(root+'/modules/pana-tools.js');
var db = require(root+'/modules/pana-db.js');
var response = require(root+'/modules/pana-response.js');
var validator = require(root+'/modules/pana-validator.js');
var constant = require(root+'/modules/constant.js');
var logger = require(root+'/modules/pana-log4js');
var communicator=new (require(root+'/modules/pana-get'));
var cipher = require(root+'/modules/pana-crypto.js');
var router = express.Router();


<!-- 获取微信配置 -->
router.get('/getWxConfig', function(req, res, next) {
  var appid="wx6e4c2f790332f816",
      appsecret="62aa7950604031c4df099658fe13709d",
      cgiUrl="https://api.weixin.qq.com/cgi-bin",
      url=req.query.url;

  //获取token
  communicator.get(cgiUrl+"/token?grant_type=client_credential&appid="+appid+"&secret="+appsecret,function(data){
    //获取ticket
    communicator.get(cgiUrl+"/ticket/getticket?access_token="+data.access_token+"&type=jsapi",function(data){
      var timestamp=new Date().getTime(),
          nonceStr="123456",
          ticket=data.ticket;

      //拼接签名string
      signatureString="jsapi_ticket="+ticket+"&noncestr="+nonceStr+"&timestamp="+timestamp+"&url="+url;
      //获取sha1加密后的signature
      signature=new cipher().encrypt(signatureString);

      wxConfig={
        appId: appid,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "onMenuShareQZone",
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "playVoice",
          "pauseVoice",
          "stopVoice",
          "onVoicePlayEnd",
          "uploadVoice",
          "downloadVoice",
          "chooseImage",
          "previewImage",
          "uploadImage",
          "downloadImage",
          "translateVoice",
          "getNetworkType",
          "openLocation",
          "getLocation",
          "hideOptionMenu",
          "showOptionMenu",
          "hideMenuItems",
          "showMenuItems",
          "hideAllNonBaseMenuItem",
          "showAllNonBaseMenuItem",
          "closeWindow",
          "scanQRCode",
          "chooseWXPay",
          "openProductSpecificView",
          "addCard",
          "chooseCard",
          "openCard"
        ]
      };
      res.json(wxConfig);
    });
  });
});


module.exports = router;
