import request from '../../utils/request'
Page({
  data: {
    videoGroupList: [],  //导航数据
    navId: '' , //导航的标识
    videoList:[], //视频列表数据
    videoId:'', // 视频id标识
    videoUpdateTime:[], //记录m每一个video播放的时长
  },
  onLoad() {
    //获取导航数据
    this.getVideoNav()
  },
  //获取导航数据
  async getVideoNav() {
    let res = await request('/video/group/list')
    this.setData({
      videoGroupList: res.data.slice(0, 13),
      navId:res.data[0].id   //更新一个选中的导航
    })
     // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId){
    let res = await request('/video/group',{id:navId})
    let index = 0;
    if(!res.datas){
      return
    }
    let videoList = res.datas.map(item=>(item.id = index++,item))
    this.setData({
      videoList
    })

    //关闭loading提示框
    wx.hideLoading()
  }, 
  // 选中导航的回调
  changeNav(event) {

    //显示loading
    wx.showLoading({
      title:'正在加载'
    })
    // console.log("changeNav -> event", event)
    // currentTarget事件绑定的元素 外层包裹  "navItem"
    // target 事件触发的元素，"navContent"

    // id传参的方式（1）
    // let navId = event.currentTarget.id  // 传的时候是number，会自动转换为string

    //data-xx传参的方式（2）
    let navId = event.currentTarget.dataset.id  //data-xx传参不转化参数的类型，传来过是number就是number，string就是string

    this.setData({
      navId:navId>>>0 , //位移运算符，位移0位，将非number强制转换成number类型
      videoList:[]  //重置视频列表
    })

    //动态获取视频列表
    this.getVideoList(this.data.navId)
  },


  //处理视频播放(真机上没有问题，模拟器会出现一些问题-by 2020-11-12)
  handlePlay(event){
    // console.log("handlePlay -> event", event)
    /**
     * 需求（一次只能播放一个视频）
     * 1.在点击播放事件中需要找到上一个播放的视频
     * 2.在播放前把上一个正在播放的视频关掉
     * 
     * 单例模式
     * 1.需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
     * 2.节省内存空间
     */
    //创建控制video标签的实例对象
    let vid = event.target.id

    // //关闭之前的video(id,videoContent不同)
    // if(this.videoContent && this.vid !== vid){
    //   this.videoContent.stop()
    // }
    // this.vid = vid

    //更新需要播放的视频id
    this.setData({
      videoId:vid
    })

    this.videoContent = wx.createVideoContext(vid)
    //播放视频
    //判断之前是否有播放过，是否有播放记录，如果有，跳转至指定的位置
    let videoItem = this.data.videoUpdateTime.find(item=>item.vid === vid)
    if(videoItem){  // 有，跳转至指定的位置
      this.videoContent.seek(videoItem.currentTime)
    }
    this.videoContent.play()
  },
  //处理播放时长的回调
  handleTimeUpdate(event){
  // console.log("handleTimeUpdate -> event", event)
  let videoTimeObj = {
    vid:event.currentTarget.id,
    currentTime:event.detail.currentTime
  }
  let {videoUpdateTime} = this.data;
  /**
   * 思路：判断记录播放时长的videoUpdateTime数组中是否有当前的播放记录
   * 1.如果有，在原来的播放记录上更新播放时间为当前的播放时间
   * 2.如果没有，需要在数组中添加当前视频的播放对象
   */
  let videoItem = videoUpdateTime.find(item=>item.vid === videoTimeObj.vid)
  if(videoItem){  //之前有
    videoItem.currentTime = event.detail.currentTime
  }else{ //之前没有
    videoUpdateTime.push(videoTimeObj)
  }
 // 更新
  this.setData({
    videoUpdateTime
  })
  },
  //播放结束的时候
  handleEnded(event){
    // console.log('结束')
    let {videoUpdateTime} = this.data;
    let index = videoUpdateTime.findIndex(item=>item.vid === event.currentTarget.id)
    videoUpdateTime.splice(index,1)
    this.setData({
      videoUpdateTime
    })
  }
})