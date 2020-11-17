// pages/songDetail/songDetail.js
//时间格式化库 moment
import moment from 'moment'
// 消息的发布订阅
import PubSub from 'pubsub-js'
//封装的请求
import request from '../../utils/request'
//获取全局实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,  //音乐的播放状态
    song:{},  //歌曲详情对象
    musicId:'', //音乐的id
    musicLink:'', //音乐的链接
    currentTime:'00:00', //音乐实时播放时间
    durationTime: '00:00',//音乐总时长
    currentWidth:0, //实时的进度条宽度
    percentWidth:0 //实时的进度条宽度百分比
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options 用于接收路由跳转的query参数
    //原生小程序中路由传参，对参数的长度限制，如果参数的长度过长会自动截取掉
  // console.log("options", JSON.parse(options.song))

    let musicId = options.musicId;
    // console.log("musicId", musicId)
    this.setData({
      musicId
    })
    //获取音乐详情
    this.getMusicInfo(musicId)

    /**
     * 问题：如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面的显示与真实音乐的播放状态不一致
     * 解决方案
     * 1.通过控制音频的实例 backgroundAudioManager 去监听音乐的播放暂停
     */


     //判断当前页面的音乐是否在播放
     if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
       //修改当前页面音乐播放状态为true
       this.setData({
        isPlay:true
      })
     }


      //创建音乐的播放状态实例
      this.backgroundAudioManager = wx.getBackgroundAudioManager()
      //监听播放/暂停/停止
      this.backgroundAudioManager.onPlay(()=>{
        // console.log('监听播放')
        // //修改播放状态
        // this.setData({
        //   isPlay:true
        // })
        this.changePlayState(true)
        
        //修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = true
        appInstance.globalData.musicId = musicId

      })
      this.backgroundAudioManager.onPause(()=>{
        // console.log('监听暂停')
          //修改播放状态
          // this.setData({
          //   isPlay:false
          // })
          this.changePlayState(false)
           //修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = true
      })
      this.backgroundAudioManager.onStop(()=>{
        // console.log('监听停止')
           //修改播放状态
          //  this.setData({
          //   isPlay:false
          // })
          this.changePlayState(false)
           //修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = true
      })



      //监听音乐实时播放的进度
      this.backgroundAudioManager.onTimeUpdate(()=>{
        // console.log('当前音频的长度（单位：s',this.backgroundAudioManager.duration)
        // console.log('当前音频的播放位置（单位：s）',this.backgroundAudioManager.currentTime)

        //格式化实时的播放时间  (转化为ms，moment中传的是ms)
        let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
        //进度显示
        let percentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration
        this.setData({
          currentTime,
          percentWidth
        })
      })


      //监听音乐播放自然结束
      this.backgroundAudioManager.onEnded(()=>{
        //自动切换至下一首，并且自动播放

        //订阅来自recomendSong页面发布的musicId消息
        PubSub.subscribe('musicId',(msg,musicId)=>{
          // console.log(musicId)
          //获取最新的音乐详情
          this.getMusicInfo(musicId)
          //自动播放当前的音乐
          this.musicControl(true,musicId)

          //取消订阅,不然会造成多次订阅的效果，回调函数会有多个执行
          PubSub.unsubscribe('musicId');
        })
        //播放下一首
        PubSub.publish('switchType','next');
        //将实时进度条还原成0,实时播放的时间也还原成0
        this.setData({
          percentWidth:0,
          currentTime:'00:00'
        })
      })



  },
  //修改播放状态
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
  },

  //获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids:musicId})

    //获取歌曲时长 songData.songs[0].dt 单位 毫秒
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      durationTime
    })

    //动态设置窗口标题
    wx.setNavigationBarTitle({
      title:this.data.song.name
    })
  },
  //用户点击 音乐播放的控制
  musicPlay(){
    let isPlay = !this.data.isPlay

    // 修改播放状态
    // this.setData({
    //   isPlay
    // })

    //控制音乐播放/暂停
    let {musicId,musicLink} = this.data
    this.musicControl(isPlay,musicId,musicLink)
  },


  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
     
    if(isPlay){ //音乐播放
      //获取音乐的播放链接
      if(!musicLink){
        let musicLinkData = await request('/song/url',{id:musicId})
        musicLink = musicLinkData.data[0].url
        //更新音乐链接
        this.setData({
          musicLink
        })
      }
     
      //播放音乐
      this.backgroundAudioManager.src = musicLink //设置src会自动播放
      this.backgroundAudioManager.title = this.data.song.name  //必填项，不填，音乐无法播放
    }else{ //音乐暂停
      this.backgroundAudioManager.pause()
    }
  },

  //歌曲切换
  handleSwitch(event){
    // 获取切歌的类型
    let type = event.currentTarget.id

    //关闭当前播放的音乐
    this.backgroundAudioManager.stop()

    //订阅来自recomendSong页面发布的musicId消息
    PubSub.subscribe('musicId',(msg,musicId)=>{
      // console.log(musicId)
      //获取最新的音乐详情
      this.getMusicInfo(musicId)
      //自动播放当前的音乐
      this.musicControl(true,musicId)

      //取消订阅,不然会造成多次订阅的效果，回调函数会有多个执行
      PubSub.unsubscribe('musicId');
    })

    //发布消息的数据给recommendSong页面
    PubSub.publish('switchType',type);
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