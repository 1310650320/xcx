// pages/mine/card/cardapply/index.js
var Common = require('../../../../utils/Common.js')
var app = getApp();
var util = require('../../../../utils/util.js')
var C = require('../../../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday: '2016-09-01',
    name:'',
    phone:'',
    sex:'2',
    code:'',
    blackshow:false,
    items: [
      { name: '1', value: '男' },
      { name: '2', value: '女', checked: 'true' },
    ],
    codeImage:'',
  },
  // 日期选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  radioChange: function (e) {
    this.data.sex = e.detail.value;
    // console.log('radio发生change事件，携带value值为：', e.detail.value);
  },
  NameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  BirthdayInput:function(e){
    this.setData({
      birthday: e.detail.value
    })
  },
  PhoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  // 点击立即申领
  applyAction:function(e){
    var that = this;
    var _name = that.data.name;
    var _phone = that.data.phone;
    var _birthday = that.data.birthday;
    console.log(_name, _phone, _birthday);
   

    // 请求验证码接口拿到图片
    if (_name == '' || _phone == '' || _birthday==''){
      setTimeout(function () {
        wx.showToast({
          title: '请填写完整后提交',
          image: '/static/images/cuo.png',
          duration: 1500,
        })
      }, 10)
    }else{
      this.setData({
        blackshow: true
      })
      var ran = Math.random();
      that.setData({
        codeImage: C.Host + '/index.php?m=api&c=public&a=captcha&key=' + app.globalData.key+'&=' + ran,
      })
    }
   
  },
  // 切换验证码
  switchCodeImg:function(e){
   // 请求接口，拿到图片和正确答案
   var that =this;
    var ran = Math.random();
    that.setData({
      codeImage: C.Host + '/index.php?m=api&c=public&a=captcha&key=' + app.globalData.key+'&=' + ran,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '申请会员卡',
    })
  },
  // 点击确定申请
  ApplyYes:function(e){
    var that = this;
    var _name = that.data.name;
    var _phone = that.data.phone;
    var _birthday = that.data.birthday;
    var _sex = that.data.sex;
    // 验证验证码是否正确
    var _code = that.data.code;                  // 用户输入的答案

    util.$HTTP.post(C.Host + C.httpAPI['APIIsGetCode'], {
      key: app.globalData.key,
      code: _code
    }, (res) => {
      if (res.data.status == 200){
        util.$HTTP.post(C.Host + C.httpAPI['APIGetUserCard'], {
          key: app.globalData.key,
          mobile: _phone,
          name: _name,
          birthday: _birthday,
          sex: _sex
        }, (r) => {
          if (r.data.status == 200) {
            setTimeout(function () {
              wx.showToast({
                title: '申请成功',
                image: '/static/images/dui.png',
                duration: 1500
              })
            }, 10)
            this.setData({
              blackshow: false,
              phone: '',
              name: '',
              birthday: '',
            })
            wx.navigateTo({
              url: '/pages/mine/card/membershipcard',
            })
          } else {
            setTimeout(function () {
              wx.showToast({
                title: r.data.msg,
                image: '/static/images/cuo.png',
                duration: 1500
              })
            }, 10)
            that.setData({
              codeImage: C.Host + '/index.php?m=api&c=public&a=captcha&key=' + app.globalData.key + '&=' + ran,
            })
          }
        })
      }else{
        setTimeout(function(){
          wx.showToast({
            title: '请输入正确得验证码',
            image: '/static/images/cuo.png',
          })
        },10)
       
      }
      
    })


  },
  calcelaction:function(e){
    this.setData({
      blackshow:false,
      code:''
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