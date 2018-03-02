var app = getApp();
var util = require('../../utils/util.js')
var C = require('../../utils/config.js')
var Common = require('../../utils/Common.js')
var cityList = [];        // 所有省市区信息

var proArr_regionID = []; // 所有一级ID
var pro_regionID;         // 当前一级ID
var cityArr_regionID = [];// 二级所有ID
var city_regionID;        // 当前二级ID
var counArr_regionID = [];// 三级所有ID
var coun_regionID;        // 当前三级ID

var reprovince = [];      // 所有一级名字
var recity = [];          // 当前所有二级名字
var country = [];         // 当前所有三级名字


var selpro = '';          // 显示的当前一级名字
var selCity = '';         // 显示的当前二级名字
var selCoun = '';         // 显示的当前三级名字
var name = '';
var phone = '';
var siteDetail = '';
var siteID;
var addOramendState;//
var amendStateID;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: [],
    city: [],
    country: [],

    curr_pro: '',
    curr_cit: '',
    curr_cou: '',

    boolCity: "",
    boolCoun: "",
    addSite: true,
    siteListDa: [],
    selimg: '',
    addressDetail: '',
    name: '',
    phone: ''
  },


  //点击省（弹出选择器）
  bindProvinceChange: function (e) {
    console.log();
    var that = this;
    recity.splice(0, recity.length);
    country.splice(0, country.length);
    selCity = "--请选择--";
    selCoun = ""
    var inde = e.detail.value;
    selpro = reprovince[inde];
    //省数据选择ID
    pro_regionID = proArr_regionID[inde];


    that.setData({
      curr_pro: selpro,
      curr_cit: selCity,
      curr_cou: selCoun
    });

    //市数据
    cityList.forEach((item) => {
      if (selpro == item.region_name) {
        item.city.forEach((item) => {
          recity.push(item.region_name);
          cityArr_regionID.push(item.region_id)
        })
      }
    })

    that.setData({
      city: recity,
      curr_cou: selCoun,
      boolCity: "",
      boolCoun: "true"
    });
  },

  //点击市选择器
  cityAction: function (e) {

    var that = this;
    selCoun = "--请选择--";
    country.splice(0, country.length);
    var inde = e.detail.value;
    selCity = recity[inde];
    that.setData({
      curr_cit: selCity,
    });
    //获取市选择ID
    city_regionID = cityArr_regionID[inde];



    //区数据
    cityList.forEach((item) => {
      if (selpro == item.region_name) {
        item.city.forEach((item) => {
          if (selCity == item.region_name) {
            item.area.forEach((item) => {
              country.push(item.region_name);
              counArr_regionID.push(item.region_id);
            })
          }
        })
      }
    });
    that.setData({
      country: country,
      curr_cou: selCoun,
      boolCoun: ""
    });
  },
  //点击县选择器
  countyAction: function (e) {
    var that = this;
    var inde = e.detail.value;
    selCoun = country[inde];

    //获取县选择ID
    coun_regionID = counArr_regionID[inde];
    that.setData({
      curr_cou: selCoun
    });
  },
  //收货人
  nameAction: function (e) {
    name = e.detail.value;
  },
  //联系电话
  phoneAction: function (e) {
    phone = e.detail.value;
  },
  //详细地址
  siteDetailAction: function (e) {
    siteDetail = e.detail.value;
  },


  //确定按钮，保存并发送数据
  confirmAction: function (e) {

    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (name.length == 0 || name == undefined || name == '') {

      wx.showToast({
        title: '姓名不能为空',
        image: '/static/images/cuo.png',
        duration: 2500
      })
    } else if (!myreg.test(phone)) {


      wx.showToast({
        title: '电话号码有误',
        image: '/static/images/cuo.png',
        duration: 2500
      })
    }
    else if (selCoun.length == 0 || selCoun == undefined || selCoun == '') {

      wx.showToast({
        title: '省市县不能为空',
        image: '/static/images/cuo.png',
        duration: 2500
      })
    } else if (siteDetail.length == 0 || siteDetail == undefined || siteDetail == '') {
      wx.showToast({
        title: '详细地址不能为空',
        image: '/static/images/cuo.png',
        duration: 2500
      })
    } else {

      //判断是添加或是修改收货地址
      var dataPost;
      if (addOramendState == true) {
        //新增
        dataPost = {
          key: app.globalData.key,
          consignee: name,
          mobile: phone,
          province: pro_regionID,
          city: city_regionID,
          district: coun_regionID,
          address: siteDetail
        };

      } else {
        //修改
        dataPost = {
          key: app.globalData.key,
          address_id: amendStateID,
          consignee: name,
          mobile: phone,
          province: pro_regionID,
          city: city_regionID,
          district: coun_regionID,
          address: siteDetail
        };
      }
      util.$HTTP.post(C.Host + C.httpAPI['APIAddaddressUrl'], dataPost, (r) => {
        if (r.data.status == 200) {
          wx.showToast({
            title: r.data.msg,
            image: '/static/images/dui.png',
            duration: 2500
          })

          //收货地址添加成功，返回地址列表,重新加载地址列表
          Common.ApiCommon.CommonDataRequest({
            key: app.globalData.key,
            page: 1,
            num: 10
          }, {
              url: "APIAddressListUrl",
              success: function (r) {
                that.setData({
                  addSite: true,
                  siteListDa: r
                }); 
              }
            })
        }
      })
      //修改地址后需删除原来地址
      // var dataPost = {
      //   key: app.globalData.key,
      //   address_id: siteID
      // };
      // util.$HTTP.post(C.Host + C.httpAPI['APICancleAddressurl'], dataPost, (r) => {
      // })
    }
  },

  //删除按钮,向服务器发送数据
  cancleAction: function (e) {

    var that = this;
    wx.showModal({
      title: '确定删除该收货地址吗？',
      content: '',
      showCancel: "true",
      success: function (r) {

        var dataPost = {
          key: app.globalData.key,
          address_id: siteID
        };

        util.$HTTP.post(C.Host + C.httpAPI['APICancleAddressurl'], dataPost, (r) => {

          if (r.data.status == 200) {
            that.setData({
              addSite: true,
            })

            //删除成功后再次加载地址列表
            Common.ApiCommon.CommonDataRequest({
              key: app.globalData.key,
              page: 1,
              num: 10
            }, {
                url: "APIAddressListUrl",
                success: function (r) {
                  that.setData({
                    siteListDa: r
                  });
                }
              })

          } else {

            wx.showModal({
              title: '',
              content: '删除地址失败',
            })
          }

        })
      }
    })
  },

  //新增收货地址
  addNewSiteAction: function () {
    addOramendState = true;
    var that = this;
    selpro = '';
    selCity = '';
    selCoun = '';
    pro_regionID = '';
    city_regionID = '';
    coun_regionID = '';
    that.setData({
      addSite: false,
      name: '',
      phone: '',
      curr_pro: '--请选择--',
      curr_cit: '',
      curr_cou: '',
      addressDetail: ''
    });
  },


  //选中收货地址
  selAddressAction: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.selindex;
    that.setData({
      selimg: index
    });


    //设置该地址为默认地址
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      address_id: that.data.siteListDa[index].address_id
    }, {
        url: "APISetDefaultSiteUrl",
        success: function (r) {

        }
      })


    //关闭当前页面并跳转到
    wx.navigateBack({
      url: '/pages/submitOrder/index',
    });

  },


  //编辑收货地址,跳转地址添加页
  editAction: function (e) {
    pro_regionID;         // 当前一级ID
    cityArr_regionID = [];// 二级所有ID
    city_regionID;        // 当前二级ID
    counArr_regionID = [];// 三级所有ID
    coun_regionID;        // 当前三级ID

    recity = [];          // 当前所有二级名字
    country = [];         // 当前所有三级名字

    selCity = '';         // 显示的当前二级名字
    selCoun = '';         // 显示的当前二级名字
    addOramendState = false;
    var that = this;
    var index = e.currentTarget.dataset.selindex;
    amendStateID = that.data.siteListDa[index].address_id;
    var data = {
      id: that.data.siteListDa[index].address_id,
    }
    console.log(that.data.siteListDa);
    console.log(index);
    that.setData({
      addSite: false
    })

    //请求地址详情
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      address_id: that.data.siteListDa[index].address_id,
    }, {
        url: "APIAddressDetailUrl",
        success: function (r) {
          //初始化地址信息
          name = r.consignee;
          phone = r.mobile;
          pro_regionID = r.province;
          city_regionID = r.city;
          coun_regionID = r.district;
          selpro = r.province_name;
          selCity = r.city_name;
          selCoun = r.district_name;
          siteDetail = r.address;
          siteID = r.address_id;
          //赋值
          that.setData({
            name: r.consignee,
            phone: r.mobile,
            curr_pro: r.province_name,
            curr_cit: r.city_name,
            curr_cou: r.district_name,
            addressDetail: r.address
          })
        }
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // addressId
    var that = this;
    wx.setNavigationBarTitle({
      title: '编辑收货地址',
    })
    selpro = "-- 请选择 --"


    //根据接口获取省数据
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      parent_id: '1'
    }, {
        url: "APIregionUrl",
        success: function (r) {

          cityList = r;
          for (let i in r) {
            reprovince.push(cityList[i].region_name);
            proArr_regionID.push(cityList[i].region_id);
          }

          that.setData({
            province: reprovince,
            curr_pro: selpro,
            boolCity: "true",
            boolCoun: "true"
          });
        }
      })


    //获取地址列表
    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key,
      page: 1,
      num: 10
    }, {
        url: "APIAddressListUrl",
        success: function (r) {

          that.setData({
            siteListDa: r
          });
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {




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