//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    chessBoard: [],
    me: true,
    context: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.load();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  load: function() {
    for (var i = 0; i < 15; i++) {
      this.data.chessBoard[i] = [];
      for (var j = 0; j < 15; j++) {
        this.data.chessBoard[i][j] = 0;
      }
    }

    var context = this.data.context = wx.createCanvasContext('chess');
    context.setStrokeStyle("#BFBFBF");
    context.setLineWidth(1);

    for (var i = 0; i < 15; i++) {
      context.moveTo(15 + i * 22, 15);
      context.lineTo(15 + i * 22, 323);
      context.stroke();
      context.moveTo(15, 15 + i * 22);
      context.lineTo(323, 15 + i * 22);
      context.stroke();
    }
    context.draw()
  },
  oneStep: function (i, j, me) {
    var context = this.data.context;
    context.beginPath();
    context.arc(15 + i * 22, 15 + j * 22, 9, 0, 2 * Math.PI);
    context.closePath();

    var gradient = context.createCircularGradient(15 + i * 22 , 15 + j * 22, 22)
  
    if (me) {
      gradient.addColorStop(0, "#0A0A0A");
      gradient.addColorStop(1, "#636766");
    } else {
      gradient.addColorStop(0, "#D1D1D1");
      gradient.addColorStop(1, "#F9F9F9");
    }
    context.setFillStyle(gradient);
    context.fill();
    
    context.draw(true);
  },
  luozi: function (e) {
    var x = e.changedTouches[0].x;
    var y = e.changedTouches[0].y;
    
    var i = Math.floor(x / 22);
    var j = Math.floor(y / 22);

    if (this.data.chessBoard[i][j] == 0) {
      this.oneStep(i, j, this.data.me);
      if (this.data.me) {
        this.data.chessBoard[i][j] = 1;
      } else {
        this.data.chessBoard[i][j] = 2;
      }
      this.data.me = !this.data.me;
    }

  }
})
