var app = getApp()
var util = require('../../../utils/util.js')
var C = require('../../../utils/config.js')
var WxParse = require('../../../wxParse/wxParse.js');
var Common = require('../../../utils/Common.js');
var S_price = 0;  // 用于动态计算的商品价格
var recid = '';
Page({
  
  

  /**
   * 页面的初始数据
   */
  data: {
    shopID:'',      // 商品的ID
    detail: [],     // 商品信息
    price: "",      // 价格
    commodityNum: 1,// 商品数量
    sellcount: '',
    imgUrls: ['http://flower.xcx.vxiaoju.com/data/attached/afficheimg/1511200014336908446.jpg','http://flower.xcx.vxiaoju.com/data/attached/afficheimg/1511200014336908446.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    freight: "",    // 是否免运费

    minusBtn: "disabled",
    shopCarImg: ""

  },

  // 显示遮罩层
  showModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


  //商品减一
  minusBtnAction: function () {
    var that = this;
    var num = that.data.commodityNum;
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    //数量不同价格不同与不同规格关联-》价格=数量*规格单价
    var price = parseFloat(S_price) * num;
    console.log(price + "商品减一");
    this.setData({
      commodityNum: num,
      minusBtn: minusStatus,
      price: price
    });
  },

  //商品加一
  addBtnAction: function () {
    var that = this;
    var num = that.data.commodityNum;
    num++;
    var price = parseFloat(S_price) * num;
    console.log(price + "加一");
    // 将数值写回
    this.setData({
      commodityNum: num,
      minusBtn: "normal",
      price: price
    });
  },

  //商品手动输入
  bindManual: function (e) {
    var that = this;
    var num = e.detail.value;
    // S_num = num;
    var price = parseFloat(S_price) * num;
    console.log(price + "商品手动输入");
    // 将数值与状态写回
    that.setData({
      commodityNum: num,
      minusBtn: "normal",
      price: price
    });
  },

  //加入购物车
  addShopCar: function () {
    var that = this;
    var dataPost = {
      goods_id: that.data.shopID,
      number: that.data.commodityNum,
      key: app.globalData.key
    }
    util.$HTTP.post(C.Host + C.httpAPI['APiAddShopCarUrl'], dataPost, (r) => {
      //加入购物车成功后，刷新购物车图标，隐藏遮罩层
      if (r.data.status == 200) {
        that.setData({
          shopCarImg: '/static/images/detail1.png'
        });
        this.hideModal();
        setTimeout(function () {
          wx.showToast({
            title: '加入购物车成功！',
            image: '/static/images/dui.png',
            duration: 1500
          })
        }, 10)
        
      } else {
        setTimeout(function () {
          wx.showToast({
            title: '失败！',
            image: '/static/images/cuo.png',
            duration: 2500
          })
        }, 10)
      }
    })
  },


  //商品购买（一步购买=添加购物车+提交订单）
  buyAction: function (e) {
    var that = this;
    var dataPost = {
      goods_id: that.data.shopID,
      number: that.data.commodityNum,
      key: app.globalData.key,
    }
    app.globalData.shopCarOrderOne = JSON.stringify(dataPost);
    // 跳转订单详情页，
    wx.navigateTo({
      url: '/pages/submitOrder/index?one=1',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    S_price = 0;
   
    wx.setNavigationBarTitle({
      title: "商品详情"
    })
    var that = this;
    that.setData({
      shopID: options.id
    })
    // 拿到商品的数据、头部图片
    var resqdata = {
      goods_id :that.data.shopID
    }
    Common.ApiCommon.CommonDataRequest(resqdata, {
        url: "APishopDetail",
        success: function (r) {
          var headImgs = [];
          //头部轮播图
          for (let i in r.pictures) {
            headImgs.push(r.pictures[i].img_url);
          }
          console.log(headImgs);
          that.setData({
            detail: r.goods,
            imgUrls: headImgs,
            price: r.goods.shop_price,
          });
          // 全局变量
          S_price = r.goods.shop_price,// 用于动态计算的
          WxParse.wxParse('content', 'html', r.goods.goods_desc, that, 5);

        }
      })


    //判断购物车是否有商品--小红点的处理
    var dataPost = { key: app.globalData.key };
    util.$HTTP.post(C.Host + C.httpAPI['APIShopCarUrl'], dataPost, (r) => {

      if (r.data.result.goods_list == null || r.data.result.goods_list.length == 0 || r.data.result.goods_list == undefined || r.data.result.goods_list == '') {
        //购物车什么都没有
        that.setData({
          shopCarImg: '/static/images/tab2.png'
        });
      } else {

        that.setData({
          shopCarImg: '/static/images/detail1.png'
        });
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
    //原因未知--8.25zk
    //当页面返回显示的时候，删除一步购买加入购物车的商品
    var dataPost = {
      rec_id: recid,
      key: app.globalData.key
    };

    util.$HTTP.post(C.Host + C.httpAPI['APICancleCarShopUrl'], dataPost, (r) => {

    })
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
