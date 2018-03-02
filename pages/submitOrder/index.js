var app = getApp();
var util = require('../../utils/util.js')
var C = require('../../utils/config.js')
var Common = require('../../utils/Common.js')
var data_post;
var shippingId;
var payId;
var addressID = ''      //传过来的地址的id
var leaveAccount;
var postscript = '';    //留言
var realtotal = 0;      //存储取来的总价格
var shippingfee = 0;
var exprsssArrs = [];
Page({
  data: {
    selindex:0,
    exprarray: [],
    recID:'',       // 购物车的recid
    goods: [],      // 商品列表
    hasLogin: '',
    siteInfo: '',   // 地址信息 address_id city country district province
    express: '',    // 哪家物流
    total: 0,       // 取来的总价格
    sum: '',        
    animationData: {},
    really_total: 0,  // 用于实时计算的总价格
    shopping_fee: 0,  // 邮费
    isOnestep:0       //判断是否是一步购买
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selindex: e.detail.value
    })
  },
  navitositeAction: function () {
    wx.navigateTo({
      url: '/pages/site/index?addressId=' + addressID
    })
  },
  //输入框留言：
  bindAction: function (e) {
    postscript = e.detail.value;
  },

  //去结算
  payMoneyAction: function () {
    var that = this;
    if (leaveAccount == false) {
      wx.showModal({
        title: '提示',
        content: '请添加地址',
        showCancel: false
      })
    } else {
      //生成支付订单
      var good_id = [];
      that.data.goods.forEach((item, index) => {
        good_id.push(item.rec_id);
      })
      var typeTemp = '';
      that.data.isOnestep == 0?typeTemp = 0:typeTemp = 1;
      var dataPost = {
        key: app.globalData.key,
        // shipping_id: shippingId,
        shipping_id: exprsssArrs[that.data.selindex],
        pay_id: payId,
        postscript: postscript,
        address_id:that.data.siteInfo.address_id,
        rec_id:good_id,
        type: typeTemp
      };
      // console.log(dataPost);
      util.$HTTP.post(C.Host + C.httpAPI['APIPayFlowDoneUrl'], dataPost, (r) => {
        // console.log(r);
        if (r.data.status == 200) {
          var dataPost = {
            key: app.globalData.key,
            order_id: r.data.result.order_id, 
          }
          //订单微信支付
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
                      wx.navigateTo({
                        url: '/pages/mine/order/index',
                      })
                    }
                  })
                },
                'fail': function (re) {
                  wx.showModal({
                    title: '提示',
                    content: '支付失败',
                    showCancel: false,
                    success: function (res) {
                      wx.navigateBack({
                      })
                    }
                  })
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '下单失败',
                showCancel: false,
                success: function (res) {
                  wx.navigateBack({
                  })
                }
              })
            }
          })
        }else{
          setTimeout(function(){
            wx.showToast({
              title: r.data.msg,
              image: '/static/images/cuo.png',
            })
          },10)
          return;
        }
      })
    }
  },
  onLoad: function (options) {
    console.log(options);
    exprsssArrs = [];
    // 设置是否是一步购买。一步为1.，否则为0
    this.setData({
      isOnestep: options.one
    })
    if (options.one == 0){
      this.setData({
        recID: options.recId
      })
    }
    wx.setNavigationBarTitle({
      title: '订单提交',
    });
  },
  onReady: function () {

  },
  onShow: function () {
    postscript = '';
    realtotal = 0; // 重置取来的金额和邮费
    shippingfee = 0;
    addressID = ''; //重置地址id
    var that = this;
    var dataPost = {};
    if (that.data.isOnestep==0){
      // 不是一步购买 APISubmitOrderUrl（拿到recid）---check(拿到信息)
      dataPost = {
        key: app.globalData.key,
        rec_id: that.data.recID
      }
      util.$HTTP.post(C.Host + C.httpAPI['APICheckOrder'], dataPost, (r) => {
        // console.log(r.data.result);
        if (r.data.status != 200) {
          app.globalData.nokucun = 0;
          wx.switchTab({
            url: '/pages/shoppingTrolley/index?kucun=0',
          })
          return;
        } else {
          console.log(r.data.result.consignee.length);
          if (r.data.result.consignee.length == 0){
            wx.navigateTo({
              url: '/pages/site/index',
            })
            return;
          }
          var hasLog;
          var express;
          // 快递、地址相关信息
          if (r.data.result.consignee == 'false') {
            hasLog = false;
            express = "快递运输";
            // expressCost = 0;
            leaveAccount = false;
          } else {
            var exprarrayidArr = [];
            var exprarrayshowArr = [];
            r.data.result.shipping_list.forEach((item, index) => {
              exprarrayidArr.push(item.shipping_id);
              exprarrayshowArr.push(item.shipping_name);
            })
            exprsssArrs = exprarrayidArr;
            hasLog = true;
            leaveAccount = true;
            var siteInfo = r.data.result.consignee;
            addressID = siteInfo.address_id;                    //存储地址id
            express = r.data.result.shipping_list[0].shipping_name;
            shippingId = r.data.result.shipping_list[0].shipping_id;
            payId = r.data.result.payment_list[0].pay_id;
            shippingfee = r.data.result.shipping_list[0].shipping_fee;
          }
          // 获取商品列表计算总价 商品金额
          var cartgoods = r.data.result.cart_goods.goods_list;
          cartgoods.forEach((item, index) => {
            realtotal += parseFloat(item.goods_price * item.goods_number);
          })
          var temp_real_total = (realtotal + parseFloat(shippingfee)).toFixed(2);
          //重新渲染
          that.setData({
            exprarray: exprarrayshowArr,
            hasLogin: hasLog,
            siteInfo: siteInfo,  // 地址信息
            express: express,
            goods: r.data.result.cart_goods.goods_list, // 商品列表
            total: realtotal,               // 取来的总价格
            really_total: temp_real_total,        // 用于计算实际的总价格
            shopping_fee: shippingfee       // 邮费
          })
        }
      })
    }else{
      //是一步购买 APIOneStepBuy（拿到订单的信息） --- APIPayFlowDoneUrl（提交订单）
      dataPost = JSON.parse(app.globalData.shopCarOrderOne);
      util.$HTTP.post(C.Host + C.httpAPI['APIOneStepBuy'], dataPost, (r) => {
        // console.log("一步购买的商品数据",r.data);
        if (r.data.status != 200) {
          app.globalData.nokucun = 0;
          wx.switchTab({
            url: '/pages/home/index/index?kucun=0',
          })
          return;
        } else {
          if (r.data.result.consignee.length == 0) {
            wx.navigateTo({
              url: '/pages/site/index',
            })
            return;
          }
          var hasLog;
          var express;
          // 快递、地址相关信息
          if (r.data.result.consignee == 'false') {
            hasLog = false;
            express = "快递运输";
            // expressCost = 0;
            leaveAccount = false;
          } else {
            var exprarrayidArr = [];
            var exprarrayshowArr = [];
            r.data.result.shipping_list.forEach((item, index) => {
              exprarrayidArr.push(item.shipping_id);
              exprarrayshowArr.push(item.shipping_name);
            })
            exprsssArrs = exprarrayidArr;
            hasLog = true;
            leaveAccount = true;
            var siteInfo = r.data.result.consignee;             // 地址信息
            addressID = siteInfo.address_id;                    // 存储地址id
            express = r.data.result.shipping_list[0].shipping_name;   // 第一个快递的名字
            shippingId = r.data.result.shipping_list[0].shipping_id;  // 第一个快递的ID
            payId = r.data.result.payment_list[0].pay_id;             // 支付的ID
            shippingfee = r.data.result.shipping_list[0].shipping_fee; // 邮费
          }
          // 获取商品列表计算总价 商品金额
          var cartgoods = r.data.result.cart_goods.goods_list;
          cartgoods.forEach((item, index) => {
            realtotal += parseFloat(item.goods_price * item.goods_number);
          })
          var temp_real_total = (realtotal + parseFloat(shippingfee)).toFixed(2);
          //重新渲染
          that.setData({
            exprarray: exprarrayshowArr,
            hasLogin: hasLog,
            siteInfo: siteInfo,  // 地址信息
            express: express,
            goods: r.data.result.cart_goods.goods_list, // 商品列表
            total: realtotal,               // 取来的总价格
            really_total: temp_real_total,  // 用于计算实际的总价格
            shopping_fee: shippingfee       // 邮费
          })
        }


      })
    }
    var submitOrder = app.globalData.submitOrder;
    
   

  },
  
  onHide: function () {

  }
})
