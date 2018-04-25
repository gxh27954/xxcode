var app = getApp()

Page({
  data: {
    userInfo: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载   
    console.log('onLoad')
    this.setData({
      showNot: false
    });
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    var myDate = new Date();
    this.getContent(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate())
  },

  getContent: function (year, month, day) {
    var that = this
    wx.connectSocket({
      url: 'ws://47.95.112.35:8000'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      var jsonData = ''
      jsonData += "{"
      jsonData += "\"from\"" + ":" + "\"sentence\"" + ","
      jsonData += "\"year\"" + ":" + year + ","
      jsonData += "\"month\"" + ":" + month + ","
      jsonData += "\"day\"" + ":" + day + ","
      jsonData += "\"userInfo\"" + ":" + "\"" + that.data.userInfo.nickName + "\"" + ","
      jsonData += "}"
      wx.sendSocketMessage({
        data: jsonData,
      })
    })
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data)
      that.setData({
        sentence: data.sentence
      });
      
      if (data.sample2 != '' && data.sample2 != 'null') {
        that.setData({
          showNot: true
        })
      }
      wx.closeSocket({
      })
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
  showMyRecords: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  showClause: function () {
    wx.navigateTo({
      url: './clause/clause',
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
  },
  showHelp: function () {
    wx.navigateTo({
      url: './help/help',
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
  },
  showFeedback: function () {
    wx.navigateTo({
      url: './feedback/feedback',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})