//封装后的请求
import request from '../../utils/request'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[], //轮播图
    recommendList:[], //推荐歌单
    topList:[]  //排行榜数据
  },

  testFun(){
    console.log('hello world')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.request({
    //   url: 'http://localhost:3000/banner',
    //   data: {
    //     type:2
    //   },
    //   success: (res)=>{
    //   console.log("res", res)
    //   },
    //   fail: (err)=>{
    //   console.log("err", err)
    //   },
    // });

    
    //调用自定义函数
    // this.testFun()



    //封装后的请求
    let result = await request('/banner', { type: 2 })
    // console.log("result", result)
    this.setData({
      bannerList:result.banners
    })


    //获取推荐歌单数据
    let recommendRes = await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendRes.result
    })

    // 打印data中的数据
    // console.log(this.data.recommendList)

    // 排行榜数据
    let index = 0
    let resultArr = []
    while(index<5){
      let topListData = await request('/top/list',{idx:index++})
      let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      resultArr.push(topListItem)
      // (渲染次数多一点，等待白屏时间端，耗一点性能)
      this.setData({
        topList:resultArr
      })
    }
    // // 更新toplist (外边等待白屏时间长)
    // this.setData({
    //   topList:resultArr
    // })
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