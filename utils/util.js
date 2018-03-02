module.exports.$HTTP = {
  post: function (url, obj, success, error) {
    // wx.showLoading({
    //   title: '正在加载'
    // })
    wx.request({
      url: url,
      method: "POST",
      data: obj,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        success(res)
        wx.hideLoading()
      },
      fail: function (res) {
        // wx.showLoading({
        //   title: '网络错误'
        // })
        error(res)

      },
      complete: function () {

      }
    })
  },
  get: function (url, obj, success, error) {
    wx.showLoading({
      title: '正在加载'
    })
    wx.request({
      url: url,
      method: "GET",
      data: obj,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        success(res)
        wx.hideLoading()
      },
      fail: function (res) {
        error(res)
        wx.showLoading({
          title: '网络错误'
        })
      },
      complete: function () {

      }
    })
  }
}
