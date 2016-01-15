/**
 * html解析
 */
var root=process.cwd();
var fs = require("fs");
var juice = require("juice");
var Cheerio = require("cheerio");
var tools=require(root+"/modules/pana-tools");

/**
 * 清除空的 style 标签
 * @param $
 */
var cleanEmptyStyle = function($){
    var $styles = $("style");
    $styles.each(function(index, style){
        if($(style).is(":empty")){
            $(style).remove();
        }
    });
};

var parse = function(htmlStr,callback){

    juice.juiceResources(htmlStr, {

        preserveMediaQueries: true,

        removeStyleTags: true,

        webResources: {
            // 忽略图片
            images: false,
            // 忽略 js
            scripts: false
        }

    }, function(err, code){
        var cheerio = Cheerio.load(code);
        cleanEmptyStyle(cheerio);
        code = tools.trim(cheerio.html());
        if(typeof callback ==="function") callback(code);
    });
};


module.exports = parse;
