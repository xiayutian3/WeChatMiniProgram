// pages/recommendSong/recommendSong.js
// 消息的发布订阅
import PubSub from 'pubsub-js'
//封装后的请求
import request from '../../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//天
    month:'', //月
    recommendList:[], //每日推荐的歌曲数据
    index:0 //点击音乐的下标
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

    // 订阅来自songDetai页面发布的消息（页面间的通信）
    PubSub.subscribe('switchType', (msg,type)=>{
    // console.log("msg,type", msg,type)
    let {recommendList,index} = this.data
    if(type === 'pre'){
      // 临界值，第一首，在点击上一首，就变到最后一首
      (index === 0) && (index = recommendList.length)
      index-=1
    }else{
       // 临界值，最后一首，在点击下一首，就变到第一首
      (index ===  recommendList.length -1 ) && (index = -1)
      index+=1
    }

    //更新下标
    this.setData({
      index
    })

    //下一首或上一首的id
    let musicId = recommendList[index].id
    //将musicId回传给songDetai页面
    PubSub.publish('musicId',musicId)
    });
  },
  
  // 获取每日推荐的数据
  async getrecommendList(){
    let res = await request('/recommend/songs')
    this.setData({
      recommendList:res.recommend
    })
  },

  //跳转歌曲详情
  toSongDetail(event){
    //获取传递的参数
    let {song,index} = event.currentTarget.dataset
    //更新点击音乐的下标
    this.setData({
      index
    })
    //路由跳转传参：query参数  (已分包)
    wx.navigateTo({
      // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
      // url:'/pages/songDetail/songDetail?song='+ JSON.stringify(song)
      url:'/songPackage/pages/songDetail/songDetail?musicId='+ song.id
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