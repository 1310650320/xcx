var Common = require('../../../utils/Common.js')
var img1;
var img2;
var scanArr = new Array;
var loca;
var loca_lat;
var loca_lon;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    news: [],
    markers: []
  },

  //地图气泡点击
  markerAction: function (e) {
    // console.log("点击标记，判断手机类型")
    //判断手机类型
    var sync = wx.getSystemInfoSync();
    var plat = (sync.platform);
    if (plat == 'android') {
      wx.openLocation({
        latitude: loca_lat,
        longitude: loca_lon,
        name: loca,
        scale: 1
      })
    } else {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
        success: function (res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: loca,
            scale: 1
          })
        }
      })
    }
  },
  //拨打电话
  phoneAction: function (e) {
    var content = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone //仅为示例，并非真实的电话号码
    })
  },

  //扫描二维码，下载图片
  scanAction1: function () {
    //预览图片
    wx.previewImage({
      current: img1, // 当前显示图片的http链接
      urls: scanArr // 需要预览的图片http链接列表
    })
  },

  scanAction2: function () {
    wx.previewImage({
      current: img2, // 当前显示图片的http链接
      urls: scanArr // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '联系我们',
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("授权成功");
            }
          })
        }
      }
    })
    //联系我们
    Common.ApiCommon.CommonDataRequest({}, {
      url: "ApiUrlContact",
      success: function (r) {
        loca_lat = parseFloat(r.latitude);
        loca_lon = parseFloat(r.longitude);
        loca = r.companyaddr;

        that.setData({
          info: r,
          markers: [{
            id: 0,
            latitude: loca_lat,
            longitude: loca_lon,
            name: loca,
            desc: '我现在的位置'
          }]
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