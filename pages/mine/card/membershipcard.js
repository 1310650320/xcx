// pages/mine/card/membershipcard.js
var Common = require('../../../utils/Common.js');
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    ishaveCard:'',
    cardInfo:{}
  },
   GetCardAction: function(e){
    wx.navigateTo({
      url: '/pages/mine/card/cardapply/index',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '会员卡',
    })
    // APIMyUserCard
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
    }, {
        url: "APIMyUserCard",
        success: function (r) {
          that.setData({
            userInfo: r.user_info,
            ishaveCard: r.get_card,
            cardInfo: r.card_info
          });
          WxParse.wxParse('content', 'html', r.card_info.content, that, 5);
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