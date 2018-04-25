// pages/settings/detail/detail.js
Page({
  data:{},
  onLoad:function(option){
    //console.log(option)
    var word = option.content

    var that = this;
        wx.request({
          url: 'https://api.shanbay.com/bdc/search/?word=' + word,
            data: {},
            method: 'GET',
            success: function (res) {
                console.log(res)
                that.setData({
                    content: res.data.data.content,
                    audio: res.data.data.audio_addresses.us[0],
                    pron: res.data.data.pron,
                    definition: res.data.data.definition
                })
            },
            fail: function () {
            },
            complete: function () {
            }
        })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  search: function (e) {
    var that = this
    var content = e.detail.value
    var option = {}
    option.content = content
    //console.log(option)
    this.onLoad(option)
    /*
    wx.request({

      url: 'https://api.shanbay.com/bdc/search/?word=' + content,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log('xixi')

        var msg = res.data.msg
        if (msg == "SUCCESS") {
          wx.navigateTo({
            url: './detail?content=' + content,
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
    })*/

  }
})