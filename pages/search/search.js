Page({
  data: {
    word:''
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    
  },
  onShow: function() {
    var that = this
    that.setData({
      word: ''
    })
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '', // 分享标题
      desc: '', // 分享描述
      path: '' // 分享路径
    }
  },

  search: function (e) {
    console.log(e)
    var content = e.detail.value
    wx.request({

      url: 'https://api.shanbay.com/bdc/search/?word=' + content,
      data: {},
      method: 'GET',
      success: function (res) {
        
        console.log('xixi')

        var msg = res.data.msg
        if (msg == "SUCCESS") {
          wx.navigateTo({
            url: './detail/detail?content=' + content,
            success: function (res) {
              // success
              
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '对不起，查询不到该词信息',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }

      },
      fail: function () {
      },
      complete: function () {
        
        
      }
    })

  },


})