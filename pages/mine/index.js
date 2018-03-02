var Common = require('../../utils/Common.js')
var app = getApp();
// pages/mine/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: []
  },

  goPerson:function(){
    wx.navigateTo({
      url: '/pages/mine/person/index',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的',
    })
    // 获取个人信息
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.getUserInfo({
            success: function (res) {
              console.log("用户信息",res);
              that.setData({
                userInfo: res.userInfo
              })
            },
            fail: function (res) {
              wx.showToast({
                title: "用户信息获取失败",
                image: '/static/images/cuo.png',
                duration: 1500
              })
            }
          })
        } else {
          wx.showToast({
            title: '获取用户登录态失败！',
            image: '/static/images/cuo.png',
            duration: 1500
          })
        }
      }
    });

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
    // 获取积分
    // var that = this;
    // Common.ApiCommon.CommonDataRequest({
    //   key: app.globalData.key,
    //   // key: '2eef818bd4ab257aebceb7e6dd6824ca'
    // }, {
    //     url: "APIGetUserPoints",
    //     success: function (r) {
    //       console.log(r);
    //       that.setData({
    //         user_point: r.pay_points
    //       });
    //     }
    //   })
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