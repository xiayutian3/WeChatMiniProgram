// pages/recommendSong/recommendSong.js
//封装后的请求
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//天
    month:'', //月
    recommendList:[] //每日推荐的歌曲数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户书否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title:'请先登录',
        icon:'none',
        success:()=>{
          //跳转到登录界面
          wx.reLaunch({
            url:'/pages/login/login'
          })
        }
      })
    }
    //更新日期的状态数据
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1   //国外的月份和我们有点不一样
    })

    //获取每日推荐的数据
    this.getrecommendList()
  },
  
  // 获取每日推荐的数据
  async getrecommendList(){
    let res = await request('/recommend/songs')
    this.setData({
      recommendList:res.recommend
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