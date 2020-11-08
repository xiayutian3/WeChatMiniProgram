// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '测试数据',
    userInfo: {}
  },
  //获取用户信息回调 （第一次）
  handleGetinfo(res) {
    if (res.detail.userInfo) {  //允许
      this.setData({
        userInfo: res.detail.userInfo
      })
    }

  },
  handleParent() {
    console.log('parent')
  },
  handleChild() {
    console.log('child')
  },
  //路由跳转 需要用到api
  toLogs() {
    // 绝对路径
    // wx.navigateTo({
    //   url: '/pages/logs/logs',
    // })

    wx.redirectTo({
      url: '/pages/logs/logs',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    //修改msg的状态数据，语法：this.setData
    // console.log(this.data.msg) //this代表当前的页面实例对象

    //小程序在自身的钩子函数setData修改-同步，
    // react在自身的钩子函数setState修改是异步的 ，在非自身钩子函数修改（setTimeout）setState才是同步

    // this.setData({
    //   msg: '修改之后的数据'
    // })
    // console.log(this.data.msg)



    //授权后获取用户信息（第二次和以后，一进来，用户授权后）
    wx.getUserInfo({
      success:(res)=>{
        // console.log(res)
        // console.log(this)
        this.setData({
          userInfo:res.userInfo
        })
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
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