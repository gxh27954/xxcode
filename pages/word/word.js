var vocabulary = require('../../data/vocabulary.js')
var app = getApp()

Page({
  data: {
    userInfo: {},
    location: {}
  },
  onLoad: function (options) {
    // 打开调试
    wx.setEnableDebug({
      enableDebug: true
    })

    var that = this
    wx.getLocation({
      success: function (res) {
        that.setData({
          location: res
        })
      },
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    var myDate = new Date();
    var date = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
    this.setData({
      date: date,
      nowdate: myDate
    });
    this.getContent(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() )
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
      jsonData += "\"from\"" + ":" + "\"title\"" + ","
      jsonData += "\"year\"" + ":" + year + ","
      jsonData += "\"month\"" + ":" + month + ","
      jsonData += "\"day\"" + ":" + day + ","
      jsonData += "\"userInfo\"" + ":" + "\"" + that.data.userInfo.nickName + "\"" +  ","
      jsonData += "\"longitude\"" + ":" + "\"" + that.data.location.longitude + "\"" + ","
      jsonData += "\"latitude\"" + ":" + "\"" + that.data.location.latitude + "\"" + ","
      
      jsonData += "}"
      wx.sendSocketMessage({
        data: jsonData,
      })

    })
    wx.onSocketMessage(function (res) {
      console.log(res)
      var data = JSON.parse(res.data)
      that.setData({
        content: data.content,
        input: data.input,
        output: data.output,
        sample1: data.sample1,
        sample2: data.sample2,
        flag: data.flag
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

  pre: function () {
    var nowDate = this.data.nowdate
    if (nowDate.getFullYear() == 2018 && (nowDate.getMonth() + 1) == 3 && nowDate.getDate() == 17) {
      return
    }
    var preDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000);
    var date = preDate.getFullYear() + '-' + (preDate.getMonth() + 1) + '-' + preDate.getDate()
    this.setData({
      showNot: false,
      date: date,
      nowdate: preDate
    });

    this.getContent(preDate.getFullYear(), preDate.getMonth() + 1, preDate.getDate())
  },

  next: function () {

    var nowDate = this.data.nowdate
    var today = new Date();
    if (nowDate.getFullYear() == today.getFullYear() && nowDate.getMonth() == today.getMonth() && nowDate.getDate() == today.getDate()){
      return
    }
    var nextDate = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000); 
    var date = nextDate.getFullYear() + '-' + (nextDate.getMonth() + 1) + '-' + nextDate.getDate()
    this.setData({
      showNot: false,
      date: date,
      nowdate: nextDate
    });
    
    this.getContent(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate())
  },


  playRecords() {
    if(this.data.flag == 1) {
      wx.showModal({
        title: '咦',
        content: this.data.date + ' 已经打过卡啦',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    var that = this
    wx.connectSocket({
      url: 'ws://47.95.112.35:8000'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      var jsonData = ''
      jsonData += "{"
      jsonData += "\"from\"" + ":" + "\"playRecords\"" + ","
      jsonData += "\"year\"" + ":" + that.data.nowdate.getFullYear() + ","
      jsonData += "\"month\"" + ":" + (that.data.nowdate.getMonth() + 1) + ","
      jsonData += "\"day\"" + ":" + that.data.nowdate.getDate() + ","
      jsonData += "}"
      wx.sendSocketMessage({
        data: jsonData,
      })
      wx.closeSocket({
      })
    })

    wx.showModal({
      title: this.data.date + ' 打卡成功啦！',
      content: '快去完成题目吧',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
})