// ajax 请求封装
import config from './config'
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    //1.new promise 初始化promise实例的状态pedding
    wx.request({
      url: config.host + url, //模拟器上的地址
      // url: config.mobileHost + url,  //手机模拟地址
      data,
      method,
      success: (res) => {
        // console.log("res", res)
        //返回的数据过滤，只要data数据
        resolve(res.data)   //修改promise状态为成功状态
      },
      fail: (err) => {
        // console.log("err", err)
        reject(err) //修改promise状态为失败状态
      }
    });
  })
}