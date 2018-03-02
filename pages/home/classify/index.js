var Common = require('../../../utils/Common.js')
var leftArr = new Array;
var itemArr = new Array;
var idtemp = '';
var pageNum = 1;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftListData: [],
    rightTitle: "",
    rightData: [],
    left: 0,
    height: ""
  },
  lowerAction:function(e){
    var that = this;
    var rightDa = that.data.rightData;
    pageNum++;
    Common.ApiCommon.CommonDataRequest({
      cat_id: idtemp,
      page: pageNum+1,
      size: 5
    }, {
        url: "APishopInfo",
        success: function (r) {
          for(var i = 0;i<r.length;i++){
            rightDa.push(r[i])
          }
          that.setData({
            rightData: rightDa
          });
        }
      })
  },
  //左侧选中事件
  left_itemSelectAction: function (e) {
    var that = this;
    var left = e.currentTarget.dataset.left;
    idtemp = e.currentTarget.dataset.id
    pageNum = 0;
    console.log(idtemp);
    Common.ApiCommon.CommonDataRequest({
      cat_id: idtemp,
      page: pageNum,
      size: 5
    }, {
        url: "APishopInfo",
        success: function (r) {
          that.setData({
            rightData: r,
            // rightTitle: leftListData[left].cat_name,
          });
        }
      })
    that.setData({
      left: left,
      rightTitle: leftArr[left],
    })


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =  this;
    leftArr = [];
    itemArr = [];
    idtemp = '';
    var catid = '';
    // 拿到分类数据
    if (options.catid) {
      idtemp = options.catid;
    } 
    Common.ApiCommon.CommonDataRequest({
    }, {
        url: "APiClassfiryUrl",
        success: function (r) {
          // 获取数据的catid
          console.log(options.catid);
          if (options.catid!=undefined) {
            catid = options.catid;
          } else {
            console.log(r[0].cat_id);
            catid = r[0].cat_id;
          }
          console.log(catid);
          idtemp = catid;
          for (var i in r) {
            leftArr.push(r[i].cat_name)
            if(r[i].cat_id == catid){
              // 拿到对应id的数组索引
              that.setData({
                left:i,
                rightTitle: r[i].cat_name,
              })
            }
          }
          that.setData({
            leftListData: r,
          });
          Common.ApiCommon.CommonDataRequest({
            cat_id: idtemp,
            page: 1,
            size: 5
          }, {
              url: "APishopInfo",
              success: function (r) {
                console.log("拿到的数据为", r);
                that.setData({
                  rightData: r
                });
              }
            })
        }
      })
   
    var that = this;
    wx.setNavigationBarTitle({
      title: '商品分类',
    })

    //获取当前屏幕大小
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        // console.log(res.windowWidth)
        // console.log(height);
        if (height < 505) {
          console.log("320*568");
          that.setData({
            height: "1082rpx"
          })
        } else if (height > 505) {
          that.setData({
            height: "1104rpx"
          })
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
   
  },
  redirectCom: function (e) {
    // "/pages/home/commodity/index?id={{item.cat_id}}"
    var idd = e.currentTarget.dataset.id;
    console.log(idd);
    wx.redirectTo({
      url: '/pages/product/show/index?id='+idd
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 根据id拿到数据
    
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