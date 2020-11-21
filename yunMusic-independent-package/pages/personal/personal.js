import request from '../../utils/request'
let startY = 0; //手指起始的坐标
let moveY = 0; //手指移动的坐标
let moveDistance = 0; //手指移动的距离
Page({
  data: {
    coverTransform: 'translateY(0rpx)',
    coverTransition: '',  //过度的效果
    userInfo: {},  //用户信息
    recentPlayList:[] //用户播放记录
  },
  onLoad() {
  this.getUserInfo()
  },
  //从本地存储获取用户信息
  getUserInfo(){
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo:JSON.parse(userInfo) })
        //获取用户播放记录
      this.getUserRecentPlayList()
    }
  },
  //获取用户播放记录
  async getUserRecentPlayList(){
    let recentPlayListData = await request('/user/record',{uid:this.data.userInfo.userId,type:0})
    let index = 0
    //增加唯一值
    let recentPlayList =  recentPlayListData.allData.splice(0,10).map(item=>{
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },

  // 去登陆 页
  // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
  toLogin() {
    wx.navigateTo({
      url: "/pages/login/login"
    })
  },

  handletouchstart(event) {
    // 去掉过渡效果
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },
  handletouchmove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance <= 0) {
      return
    }
    if (moveDistance >= 80) {
      moveDistance = 80
    }
    // console.log("handletouchmove -> moveDistance", moveDistance)
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handletouchend() {
    console.log("handletouchend -> handletouchend")
    //结束后重置为初始位置，添加过渡效果
    this.setData({
      coverTransform: 'translateY(0rpx)',
      coverTransition: `transform 0.3s linear`
    })
  }
})