var util = require('util.js')
var C = require('config.js')
var ApiCommon = {
  CommonDataRequest: (dataPost, obj) => {//首页
    dataPost['appid'] = C.Appid;
    util.$HTTP.post(C.Host + C.httpAPI[obj.url], dataPost, (r) => {
      var data = r.data.result
      // if (r.data.status) {//显示接口错误
      //   wx.showToast({
      //     title: r.data.msg,
      //     icon: 'loading',
      //     duration: 2000
      //   })
      // }
      typeof obj.success == "function" && obj.success(data);
    })
  },

  
  sessionKey: function ($code, obj) {
    
    // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
    var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + C.Appid + "&secret=" + C.AppSecret + "&js_code=" + $code + "&grant_type=authorization_code"
    util.$HTTP.get(url, (r) => {
      //console.log(r);
      typeof obj.success == "function" && obj.success(data);
    })
  }
}
var obj2string = function (o) {
  var r = [];
  if (typeof o == "string") {
    return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
  }
  if (typeof o == "object") {
    if (!o.sort) {
      for (var i in o) {
        r.push(i + ":" + this.obj2string(o[i]));
      }
      // if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
      r.push("toString:" + o.toString.toString());
      // }
      r = "{" + r.join() + "}";
    } else {
      for (var i = 0; i < o.length; i++) {
        r.push(this.obj2string(o[i]))
      }
      r = "[" + r.join() + "]";
    }
    return r;
  }
  return o.toString();
}
module.exports.ApiCommon = ApiCommon
module.exports.obj2string = obj2string