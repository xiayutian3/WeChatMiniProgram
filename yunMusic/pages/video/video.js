import request from '../../utils/request'
Page({
  data: {
    videoGroupList: [],  //导航数据
    navId: ''  //导航的标识
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
  },
  // 选中导航的回调
  changeNav(event) {
    // console.log("changeNav -> event", event)
    // currentTarget事件绑定的元素 外层包裹  "navItem"
    // target 事件触发的元素，"navContent"

    // id传参的方式（1）
    // let navId = event.currentTarget.id  // 传的时候是number，会自动转换为string

    //data-xx传参的方式（2）
    let navId = event.currentTarget.dataset.id  //data-xx传参不转化参数的类型，传来过是number就是number，string就是string

    this.setData({
      navId:navId>>>0  //位移运算符，位移0位，将非number强制转换成number类型
    })
  }
})