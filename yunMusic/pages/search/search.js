// pages/search/search.js
//封装后的请求
import request from '../../utils/request'
let isSend = false  //用于函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'', //placeholder的内容
    hotList:[], //热搜榜数据
    searchContent:'', //用户输入的表单项数据
    searchList:[] //关键字模糊匹配的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取初始化数据
      this.getInitData()

  },

  //获取初始化数据
  async getInitData(){
    let res = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent:res.data.showKeyword,
      hotList:hotListData.data
    })
  },

  //处理input实时搜索
  handleInput(event){
    // console.log(event)
    //更新searchContent的状态数据
    this.setData({
      searchContent:event.detail.value.trim()
    })

    //函数节流
    if(isSend){
      return
    }
    isSend = true

    setTimeout(async()=>{
       //发请求获取关键字模糊匹配的数据
    let res = await request('/search',{keywords:this.data.searchContent,limit:10})
    this.setData({
      searchList:res.result.songs
    })
    isSend = false
    },300)
   
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