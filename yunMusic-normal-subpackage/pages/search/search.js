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
    searchList:[], //关键字模糊匹配的数据
    historyList:[] //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取初始化数据
      this.getInitData()
      // 获取本地历史记录的功能函数
      this.getSearchHistory()
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

  // 获取本地历史记录的功能函数
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory')
    if(historyList){
      this.setData({
        historyList
      })
    }
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
      //如果没有关键字，就不发请求,搜索结果置为空
      if(!this.data.searchContent){
        this.setData({
          searchList:[]
        })
        return
      }
       //发请求获取关键字模糊匹配的数据
    let res = await request('/search',{keywords:this.data.searchContent,limit:10})
    this.setData({
      searchList:res.result.songs
    })
    isSend = false

    // 将搜索关键字放到历史记录中
    let {historyList,searchContent} = this.data
    //如果之前存在历史记录，就删除掉
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    //在前面添加历史记录
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    //将历史记录存本地，防止用户刷新界面
    wx.setStorageSync('searchHistory',historyList)

    },300)
   
  },

  //清空输入内容
  clearSearchContent(){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },


  //删除历史记录
  deleteSearchHistory(){

    wx.showModal({
      content: '确认删除吗',
      success :(res) =>{
        if (res.confirm) {
          // console.log('用户点击确定')
          //清除data中
          this.setData({
            historyList:[]
          })
          //清除本地存储的 
          wx.removeStorageSync('searchHistory')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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