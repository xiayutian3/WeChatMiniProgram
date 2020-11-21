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
      header: {
        // [
        // "NMTID=00Oxn667cYLvg9GpkgOpVLwriSPHEQAAAF1t4TjJQ; Max-Age=315360000; Expires=Sat 9 Nov 2030 13:35:40 GMT; Path=/;",
        // "__csrf=b7815fb3c49e558d703727ad3477c3ae; Max-Age=1296010; Expires=Thu 26 Nov 2020 13:35:50 GMT; Path=/;",
        // "MUSIC_U=b4bfdd1ae89309529412c8f90ac7aa6de50bd6e386c3c4d70aa13e9f0716a20a33a649814e309366; Max-Age=1296000; Expires=Thu 26 Nov 2020 13:35:40 GMT; Path=/;",
        // "__remember_me=true; Max-Age=1296000; Expires=Thu 26 Nov 2020 13:35:40 GMT; Path=/;"
        // ]
        // 添加cookie
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : '' //同步读取，确保准确性
      },
      success: (res) => {
        if (data.isLogin) {  //登录请求的时候，才保存cookie，其他请求不保存
          wx.setStorage({  //将cookie保存至本地
            key: 'cookies',
            data: res.cookies
          })
        }
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