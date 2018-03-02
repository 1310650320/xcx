var Common = require('../../utils/Common.js');
var util = require('../../utils/util.js')
var C = require('../../utils/config.js')
var value;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:[],
    nullTopno:'none',
    nullBotno:'',
  },
//失去焦点时获取输入值
  bindAction:function(e){
  value = e.detail.value;
  },
//搜索商品
  searchAction:function(){
    var that = this;
    var dataPost = { keywords:value};
    util.$HTTP.post(C.Host + C.httpAPI['APISearchUrl'], dataPost, (r) => {
      if (r.data.status==200){
        that.setData({
          product: r.data.result,
          nullTopno: 'none',
          nullBotno: 'flex'
        })
      } else if (r.data.status == 201){
        that.setData({
          nullTopno: 'flex',
          nullBotno: 'none'
        })
      }
  })


  
  },

//点击完成时触发
  bindconfirm:function(e){


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  wx.setNavigationBarTitle({
    title: '搜索',
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