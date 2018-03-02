var Common = require('../../../utils/Common.js')
var util = require('../../../utils/util.js')
var C = require('../../../utils/config.js')
var app = getApp();
var order_id;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    info:[],
    product:[],  
    status:'',
    countDown:'',
    sel:'',
    logis:'',
    countDownStr:''
  },

  //去付款
  gotoPayAction:function(){

    //订单微信支付
    var dataPost = {
      key: app.globalData.key,
      order_id: order_id
    }
    util.$HTTP.post(C.Host + C.httpAPI['APIWxPayUrl'], dataPost, (res) => {

      if (res.statusCode == 200) {

        //支付
        wx.requestPayment({
          'timeStamp': res.data.result.timeStamp,
          'nonceStr': res.data.result.nonceStr,
          'package': res.data.result.package,
          'signType': 'MD5',
          'paySign': res.data.result.paySign,
          'success': function (re) {

            wx.showModal({
              title: '提示',
              content: '支付成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({

                  })
                }
              }
            })
          },
          'fail': function (re) {

            wx.showModal({
              title: '提示',
              content: '支付失败',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {

                  wx.navigateBack({
                    
                  })                
                }
              }
            })
          }
        })
      }
    })
  },

  //查看物流
  skipLogistics:function(){
    var that = this;
    app.globalData.orderId = that.data.info.order_id;
      wx.redirectTo({
        url: '/pages/home/logistics/index?state=10',
      })
  },

//确认收货
  confirmTakeAction:function(){

    var dataPost = {
      key: app.globalData.key,
      order_id: order_id
    }
    util.$HTTP.post(C.Host + C.httpAPI['APIConfirmTakeUrl'], dataPost, (r) => {

      wx.showModal({
        title: '提示',
        content: '确认收货成功，请返回上一页',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            })
          }
        }
      })

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var state = options.type;
    var navStr;
    if (state == "1") {

      navStr = '待付款订单';
      that.setData({
        countDown: true,
        sel: '1',
        logis:true,
      })
    } else if (state == "2") {

      navStr = '待发货订单';
      that.setData({
        countDown: false,
        sel: '3',
        logis: true
      })
    } else if (state == "3") {

      navStr = '待收货订单';
      that.setData({
        countDown:true,
        sel: '2',
        logis: false,
        countDownStr: "订单将在签收7天后自动确认收货"
      })

    } else if (state == "4") {

      navStr = '已完成订单';
      that.setData({
        countDown: false,
        sel: '3',
        logis: false
      })
    }

    wx.setNavigationBarTitle({
      title: navStr,
    })

    
    //获取订单详情
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      order_id: options.order_id

    }, {
        url: "APIOrderDetailUrl",
        success: function (r) {

          order_id = r.order.order_id;

          that.setData({
            product: r.goods_list,
            info: r.order,
            status: navStr.substring(0,3)
          })
// ---------------


        // 代付款订单，倒计时取消订单
          if (state == 1){

            //订单到期时间 = 下单时间+24小时后
            //时间转为时间戳
            var EndTime = parseInt(r.order.add_time) + 84600;
            //现在时间
            var NowTime = parseInt(new Date().getTime());
            var total_micro_second = EndTime * 1000 - NowTime;
            // 渲染倒计时时钟
            if (total_micro_second > 0) {

              var inter = setInterval(function () {
                total_micro_second -= 1000;
                // 总秒数
                var second = Math.floor(total_micro_second / 1000);
                // 天数
                // var days = Math.floor(second / 3600 / 24);
                // 小时
                var hours = Math.floor(second / 3600 % 24);
                // 分钟
                var minutes = Math.floor(second / 60 % 60);
                // 秒
                var seconds = Math.floor(second % 60);

                that.setData({
                  countDownStr: '请于' + hours + "小时" + minutes + "分" + seconds + "秒内付款,超时订单将自动关闭"
                })
                if (hours == '00' && minutes == '00' && seconds == '00') {

                  clearInterval(inter);
                  that.setData({
                    countDownStr: "订单已取消"
                  });
                }
              }, 1000)
            } else {

              that.setData({
                countDownStr: "订单已取消"
              });
            }
        }

// ---------------

        }
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})