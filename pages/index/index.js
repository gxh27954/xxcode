const conf = {
  data: {
    hasEmptyGrid: false
  },
  getSystemInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.setData({
        scrollViewHeight: res.windowHeight * res.pixelRatio || 667
      });
    } catch (e) {
      console.log(e);
    }
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    var that = this
    wx.connectSocket({
      url: 'ws://47.95.112.35:8000'
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      var jsonData = ''
      jsonData += "{"
      jsonData += "\"from\"" + ":" + "\"records\"" + ","
      jsonData += "\"year\"" + ":" + year + ","
      jsonData += "\"month\"" + ":" + month + ","
      jsonData += "}"
      wx.sendSocketMessage({
        data: jsonData,
      })
    })

    let days = [];
    
    wx.onSocketMessage(function (res) {
      console.log(res)
      
      let flags = []
      var data = res.data
      //data = JSON.parse(data)
      var temp = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i] == ' ') {
          flags.push(temp)
          temp = 0
        } else {
          temp = temp * 10 + (data[i] - '0')
        }
      }

      for (let i = 0; i < flags.length; i++) {
        days[flags[i] - 1][1] = 1
      }

      that.setData({
        days,
      });
      wx.closeSocket({
        
      })
    })



    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      var list = [i, 0]
      days.push(list);
    }

    this.setData({
      days,
    });

  },

  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.getSystemInfo();
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '小程序日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/index/index'
    }
  }
};

Page(conf);
