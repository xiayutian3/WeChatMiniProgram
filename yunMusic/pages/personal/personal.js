let startY = 0; //手指起始的坐标
let moveY = 0; //手指移动的坐标
let moveDistance = 0; //手指移动的距离
Page({
  data: {
    coverTransform: 'translateY(0rpx)',
    coverTransition:''   //过度的效果
  },
  handletouchstart(event) {
    // 去掉过渡效果
     this.setData({
      coverTransition:''
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
      coverTransition:`transform 0.3s linear`
    })
  }
})