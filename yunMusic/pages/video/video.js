import request from '../../utils/request'
Page({
  data: {
    videoGroupList: [],  //导航数据
    navId: '' , //导航的标识
    videoList:[] 
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


  //处理视频播放
  handlePlay(event){
    console.log("handlePlay -> event", event)
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
    
    //关闭之前的video(id,videoContent不同)
    if(this.videoContent && this.vid !== vid){
      this.videoContent.stop()
    }
    this.vid = vid
    this.videoContent = wx.createVideoContext(vid)
  }

})