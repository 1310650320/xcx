var app = getApp();
var util = require('../../utils/util.js')
var C = require('../../utils/config.js')
var Common = require('../../utils/Common.js')
var recIDArr = new Array;
var shopNum = [];
var total;      //商品总价格

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: [],
    norms: 0,
    shopNum: shopNum,
    minusBtn: "disabled",
    addbtn: "",
    total: 0,
    checkAllPic: '/static/images/shop.png',
    allSelect: 1,
    emptyCar: '',
    total_num: 0
  },
  calc_totalnum() {
    var that = this;
    var totalnum = 0;
    var product = that.data.product;
    product.forEach((item, index) => {
      if (item.select == "1") {
        totalnum += parseInt(item.goods_number);
      }
    })
    that.setData({
      total_num: totalnum
    })
  },

  //商品减一(判断是否选中并更新总价)
  minusBtnAction: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var product = that.data.product;
    // console.log(product[index]);
    if (product[index].select === false) {

      that.setData({
        minusBtn: "disabled",
        addbtn: "disabled"
      });
    }
    if (product[index].goods_number > 1) {
      product[index].goods_number--;
    } else {
      return;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = product[index].goods_number <= 1 ? 'disabled' : 'normal';
    //计算商品总价格
    total -= parseFloat(product[index].goods_price);
    // 将数值与状态写回
    that.setData({
      minusBtn: minusStatus,
      total: total.toFixed(2),
      product
    });
    that.calc_totalnum()
  },
  //商品加一（判断是否选中并更新总价）
  addBtnAction: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var product = that.data.product;

    product[index].goods_number++;
    total += parseFloat(product[index].goods_price);
    // 将数值写回
    this.setData({
      minusBtn: "normal",
      total: total.toFixed(2),
      product
    });
    that.calc_totalnum()
  },



  //删除商品
  cancleAction: function (e) {
    var that = this;
    // console.log(recIDArr);
    wx.showModal({
      title: '确定删除该商品?',
      success: function (res) {
        if (res.confirm) {
          var dataPost = {
            rec_id: recIDArr[e.currentTarget.dataset.index],
            key: app.globalData.key
          };

          util.$HTTP.post(C.Host + C.httpAPI['APICancleCarShopUrl'], dataPost, (r) => {
            if (r.data.msg == "删除成功") {
              recIDArr.splice(e.currentTarget.dataset.index, 1);
              //删除成功后再次加载购物车商品
              Common.ApiCommon.CommonDataRequest({
                key: app.globalData.key
              }, {
                  url: "APIShopCarUrl",
                  success: function (r) {
                    if (r.goods_list == null || r.goods_list.length == 0 || r.goods_list == undefined || r.goods_list == '') {
                      //购物车什么都没有
                      that.setData({
                        emptyCar: true
                      })
                    } else {
                      // var product = that.data.product;
                      //清空数组
                      // product.length = [];
                      // product = r.goods_list;
                      // //
                      // for (var i in r.goods_list) {
                      //    r.goods_list[i].select = '1';
                      // }
                      // that.setData({
                      //   total: r.total.goods_amount,
                      //   emptyCar: false,
                      //   product
                      // });
                      // // that.calc_totalnum()


                      total = r.total.goods_amount;
                      recIDArr = [];
                      for (var i in r.goods_list) {
                        recIDArr.push(r.goods_list[i].rec_id);
                        shopNum.push(r.goods_list[i].goods_number);
                        var recid = r.goods_list[i].rec_id;
                        r.goods_list[i].select = '1';
                        var num = r.goods_list[i].goods_number;
                      }

                      that.setData({
                        product: r.goods_list,
                        total: r.total.goods_amount,
                        shopNum: shopNum,
                        emptyCar: false
                      })
                      // that.calc_totalnum()

                    }
                  }
                })
              wx.showToast({
                title: "删除成功",
                image: '/static/images/dui.png',
                duration: 1500
              })
            }
          })
        } else if (res.cancel) {
          return;
        }
      }
    })


  },


  //商品单选（重新计算价格计算价格，并更新立即结算的参数）
  checkOneAction: function (e) {
    var that = this;
    var allSelect = that.data.allSelect;
    var index = e.currentTarget.dataset.index;
    var product = that.data.product;
    if (index !== "" && index != null) {
      product[parseInt(index)].select = !product[parseInt(index)].select;
      this.setData({
        allSelect: 0,
        product
      });
    }
    // 计算价格 8.23--zk
    total = 0;
    product.forEach((item, index) => {
      if (item.select == "1") {
        total += product[index].goods_number * product[index].goods_price;
      }
    })

    // 如果有一个没有选择，就全选取反
    if (product[index].select == '0') {
      // console.log('此时取反');
      this.setData({
        allSelect: 0,
      });
    }

    var flag = 0;
    if (!that.data.allSelect) {
      product.forEach((item, index) => {
        if (product[index].select == '0') {
          flag = 1;
        }
      })
    }
    if (!flag) {
      that.setData({
        allSelect: 1,
      });
    }

    this.setData({
      total: total
    });
    that.calc_totalnum()
  },


  //商品全选(改变价钱)更新立即结算的参数
  checkAllAction: function () {

    //改变所有商品图标，
    var that = this;
    var currentAllSelect = that.data.allSelect;
    var product = that.data.product;

    if (currentAllSelect == 1) {
      for (var i = 0; i < product.length; i++) {
        var curItem = product[i];
        curItem.select = 0;
      }
      that.setData({
        allSelect: 0,
        total: 0
      });

    } else {
      total = 0;
      for (var i = 0; i < product.length; i++) {
        var curItem = product[i];
        curItem.select = 1;

        total += product[i].goods_number * product[i].goods_price;
      }

      that.setData({
        allSelect: 1,
        total: total
      });
    }

    that.setData({
      product
    });
    that.calc_totalnum()
  },


  //提交订单（去结算）
  accountsAction: function () {
    var tempproduct = [];
    var that = this;
    var product = that.data.product;
    var rec_idArr = [];
    var numArr = [];
    for (let i in product) {
      product[i].goods_number = product[i].goods_number.toString();
      if (product[i].select == '1') {
        /*新的处理方式*/
        var obj = {}
        obj.rec_id = product[i].rec_id;
        obj.goods_id = product[i].goods_id;
        obj.goods_number = product[i].goods_number;
        tempproduct.push(obj);
        // end
        rec_idArr.push(product[i].rec_id);
        numArr.push(product[i].goods_number);
      }
    }
    //传递参数
    var dataPost = { 
      rec_id: JSON.stringify(tempproduct), 
      key: app.globalData.key 
    };

    util.$HTTP.post(C.Host + C.httpAPI['APISubmitOrderUrl'], dataPost, (r) => {
      console.log(r.data);
      wx.navigateTo({
        url: '/pages/submitOrder/index?one=0&recId=' + r.data.result.rec_id,
      })
    })
    //跳页
   
    // app.globalData.shopCarOrder = JSON.stringify(tempproduct);
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    // that.setData({
    //   recIDArr:[]
    // })
    // console.log("初始rec数组为", that.recIDArr);
    // that.recIDArr = [];
    wx.setNavigationBarTitle({
      title: '购物车',
    })
    //获取我的购物车
    var dataPost = {
      key: app.globalData.key
    };


    Common.ApiCommon.CommonDataRequest({
      key: app.globalData.key
    }, {
        url: "APIShopCarUrl",
        success: function (r) {

          if (r.goods_list == null || r.goods_list.length == 0 || r.goods_list == undefined || r.goods_list == '') {
            //购物车什么都没有
            that.setData({
              emptyCar: true
            })

          } else {
            total = r.total.goods_amount;
            recIDArr = [];
            for (var i in r.goods_list) {
              recIDArr.push(r.goods_list[i].rec_id);
              shopNum.push(r.goods_list[i].goods_number);
              var recid = r.goods_list[i].rec_id;
              r.goods_list[i].select = '1';
              var num = r.goods_list[i].goods_number;
            }

            that.setData({
              product: r.goods_list,
              total: r.total.goods_amount,
              shopNum: shopNum,
              checkAllPic: '/static/images/shop.png',
              emptyCar: false
            })
            that.calc_totalnum()
          }
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
    if (app.globalData.nokucun == 0) {
      setTimeout(function () {
        wx.showToast({
          title: '库存不足！',
          image: '/static/images/cuo.png',
        }, 3000);
      }, 500)
      app.globalData.nokucun = 1;
    }
    this.recIDArr = [];
    this.onLoad();
    this.setData({
      allSelect: 1
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