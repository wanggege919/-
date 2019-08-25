
Page({
  onTap: function(){
    // wx.navigateTo({
    //   url: '../posts/posts'
    // })
    // wx.redirectTo({
    //   url: '../posts/posts'
    // })
    
    // 跳转到tabBar页面，其他路由都不行
    wx.switchTab({
      url: '../posts/posts'
    })
  }
})