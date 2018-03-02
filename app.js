
//app.js
var util = require('./utils/util.js')
var C = require('./utils/config.js')
App({
  onLaunch: function () {

    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (lr) {
          // console.log("获得code",lr); // 获得code
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var encryptedData = res.encryptedData
              var signature = res.signature
              var iv = res.iv
              var Code = lr.code//Common.obj2string(lr)
              //调用登录接口，获取key值
              // console.log('encryptedData',encryptedData);
              // console.log(signature);
              // console.log('iv',iv);
              // console.log('code',Code);
              var dataPost = {
                signature: signature,
                encryptedData: encryptedData,
                Code: Code,
                iv: iv,
                appsecret: "5ab53ed61f4d362908d37517dda33c8f"
              };
              dataPost['appid'] = C.Appid;
              // console.log('dataPost', dataPost);
              util.$HTTP.post(C.Host + C.httpAPI['APIUserGetKey'], dataPost, (r) => {
                console.log(r);
                if (r.data.status == 0) {
                  that.globalData.key = r.data.key;
                  // that.globalData.key = '74cda966bfe45da53157e46564587b30';
                  console.log("key值为", r.data.key )
                } else {
                  wx.showModal({
                    title: '提示',
                    content: 'key为空，请先登录',
                    showCancel: false,
                    success: function (r) {
                    }
                  })
                }
              })
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData: {
    userInfo: null,
    // key:'2eef818bd4ab257aebceb7e6dd6824ca'
    nokucun:1
  }
})
