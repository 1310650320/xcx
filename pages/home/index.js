//index.js
//获取应用实例
var app = getApp()
var Common = require('../../utils/Common.js')
var util = require('../../utils/util.js')
var C = require('../../utils/config.js')
var pageNum;
pageNum = 1;

Page({
  data: {
    categoryList:[],
    bannerList:[],
    product:[],
    // swiper
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    keywords:[]
  },
  // 页面加载时
  onLoad: function () {


  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    if (app.globalData.nokucun == 0) {
      setTimeout(function () {
        wx.showToast({
          title: '库存不足！',
          image: '/static/images/cuo.png',
        }, 3000);
      }, 500)
      app.globalData.nokucun = 1;
    }
    // 重置分页为1
    pageNum = 1;
    //首页分享
    wx.showShareMenu({
      withShareTicket: true
    })
    //调用应用实例的方法获取全局数据
    var that = this;
    //首页导航栏标题
    wx.setNavigationBarTitle({
      title: '首页'
    })
    //首页推荐商品
    Common.ApiCommon.CommonDataRequest({
      is_commend: 1,
      size: 10,
      page: pageNum
    }, {
        url: "APiHomeUrl",
        success: function (r) {
          // console.log(r);
          var keywordsArr = []
          r.category.forEach((item, index) => {
            keywordsArr.push(item.keywords);
          })
          console.log(keywordsArr);
          that.setData({
            bannerList: r.banner,
            categoryList: r.category,
            product: r.recommend_category,
            keywords: keywordsArr
          });
        }
      })

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
    // console.log("到底部了");
    // pageNum = pageNum + 1;
    // var that = this;
    // Common.ApiCommon.CommonDataRequest({
    //   is_commend: 1,
    //   size: 10,
    //   page: pageNum
    // }, {
    //     url: "APiHomeUrl",
    //     success: function (r) {

    //       if (r === null) {

    //         return;
    //       } else {

    //         for (var i in r) {

    //           that.data.product.push(r[i]);
    //         }
    //         that.setData({
    //           product: that.data.product
    //         })
    //       }
    //     }
    //   })
  }
});



