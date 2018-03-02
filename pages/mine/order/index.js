var Common = require('../../../utils/Common.js')
var app = getApp();
var pageNum;
pageNum = 1;
var tapIndex;//点击顶部
var scrollIndex;//滑动
var allOrder = [];
var waitPay = [];
var waitDeliver = [];
var waitTake = [];
var complete = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topArr: ["全部", "待付款", "待发货", "待收货", "已完成"],
    sel: 0,
    height: "",
    allOrder: [],
    waitPay: [],
    waitDeliver: [],
    waitTake: [],
    complete: [],
  },

  //顶部菜单栏点击事件
  clickBtnViewAction: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.sel;
    tapIndex = index;
    scrollIndex = index;
    that.setData({
      sel: tapIndex
    })
  },

  cancleAction: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          var _that = that;
          // console.log("删除商品的id是：", e.currentTarget.dataset.id);
          Common.ApiCommon.CommonDataRequest({
            key: app.globalData.key,
            order_id:e.currentTarget.dataset.id
          }, {
              url: "APIOrderCancleUrl",
              success: function (r) {
                //取消订单成功后再次加载订单列表
                allOrder = [];
                waitPay = [];
                waitDeliver = [];
                waitTake = [];
                complete = [];
                pageNum = 1;
                Common.ApiCommon.CommonDataRequest({
                  key: app.globalData.key,
                  size: 100,
                  page: pageNum
                }, {
                    url: "APIOrderUrl",
                    success: function (r) {
                      for (let i in r) {
                        if (r[i].type == "1") {
                          waitPay.push(r[i]);
                          allOrder.push(r[i]);
                        } else if (r[i].type == "2") {
                          waitDeliver.push(r[i]);
                          allOrder.push(r[i]);
                        } else if (r[i].type == "3") {
                          waitTake.push(r[i]);
                          allOrder.push(r[i]);
                        } else if (r[i].type == "4") {
                          complete.push(r[i]);
                          allOrder.push(r[i]);
                        }
                      }
                      // 重新渲染数据
                      _that.setData({
                        allOrder: allOrder,
                        waitPay: waitPay,
                        waitDeliver: waitDeliver,
                        waitTake: waitTake,
                        complete: complete,
                      })
                    }
                  })
              }
            })
        }
      }
    })

  },

  //跳页
  pageSkipAction: function (e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  //查看物流
  logisticsAction: function (e) {
    app.globalData.orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/home/logistics/index?state=10"
    })
  },

  //已完成，删除订单
  deleteAction: function (e) {

    wx.showModal({
      title: '提示',
      content: '确认删除该订单吗，删除后不可再恢复！',
      success: function (res) {
        if (res.confirm) {

          var that = this;
          Common.ApiCommon.CommonDataRequest({
            key: app.globalData.key,
            order_id: e.currentTarget.dataset.id

          }, {
              url: "APICancleOrderUrl",
              success: function (r) {

                //取消订单成功后再次加载订单列表
                allOrder = [];
                waitPay = [];
                waitDeliver = [];
                waitTake = [];
                complete = [];
                pageNum = 1;
                Common.ApiCommon.CommonDataRequest({
                  key: app.globalData.key,
                  size: 100,
                  page: pageNum
                }, {
                    url: "APIOrderUrl",
                    success: function (r) {

                      for (let i in r) {
                        if (r[i].type == "1") {
                          waitPay.push(r[i]);
                          allOrder.push(r[i]);
                        } else if (r[i].type == "2") {
                          waitDeliver.push(r[i]);
                          allOrder.push(r[i]);
                        } else if (r[i].type == "3") {
                          waitTake.push(r[i]);
                          allOrder.push(r[i]);
                        } else if (r[i].type == "4") {
                          complete.push(r[i]);
                          allOrder.push(r[i]);
                        }
                      }
                      that.setData({
                        allOrder: allOrder,
                        waitPay: waitPay,
                        waitDeliver: waitDeliver,
                        waitTake: waitTake,
                        complete: complete,
                      })
                    }
                  })
              }
            })

        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的订单',
    })
    tapIndex = options.skip;


    //获取设备信息
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 45;
        that.setData({
          height: height
        })
      }
    })
    that.setData({
      sel: tapIndex
    })


    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      size: 10,
      page: pageNum
    }, {
        url: "APIOrderUrl",
        success: function (r) {
          for (let i in r) {
            if (r[i].type == "1") {
              waitPay.push(r[i]);
              allOrder.push(r[i]);
            } else if (r[i].type == "2") {
              waitDeliver.push(r[i]);
              allOrder.push(r[i]);
            } else if (r[i].type == "3") {
              waitTake.push(r[i]);
              allOrder.push(r[i]);
            } else if (r[i].type == "4") {
              complete.push(r[i]);
              allOrder.push(r[i]);
            }
          }
          that.setData({
            allOrder,
            waitPay,
            waitDeliver,
            waitTake,
            complete,
          });
          // console.log("waitpayzhi", that.data.waitPay);

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
  onShow: function (options) {
    var that = this;
    allOrder = [];
    waitPay = [];
    waitDeliver = [];
    waitTake = [];
    complete = [];
    pageNum = 1;
    //获取全部订单数据


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
    pageNum = pageNum + 1;
    var that = this;
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      size: 10,
      page: pageNum
    }, {
        url: "APIOrderUrl",
        success: function (r) {
          if (r == null || r.length == 0 || r == undefined || r == '' || r == []) {

            return;
          } else {

            for (let i in r) {
              if (r[i].type == "1") {
                waitPay.push(r[i]);
                allOrder.push(r[i]);
              } else if (r[i].type == "2") {
                waitDeliver.push(r[i]);
                allOrder.push(r[i]);
              } else if (r[i].type == "3") {
                waitTake.push(r[i]);
                allOrder.push(r[i]);
              } else if (r[i].type == "4") {
                complete.push(r[i]);
                allOrder.push(r[i]);
              }
            }

            // console.log(allOrder);
            that.setData({
              allOrder: allOrder,
              waitPay: waitPay,
              waitDeliver: waitDeliver,
              waitTake: waitTake,
              complete: complete,
            })
          }

        }
      })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})