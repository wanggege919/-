
var postsData = require('../../data/posts-data.js') //必须相对路径

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化，options为页面跳转所带来的参数
    this.setData({
      post_content: postsData.postList
    })
  },
  onPostTap: function(event){
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: './post-detail/post-detail?id='+postId
    })
  },
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid
    console.log(event)
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId
    })
  }
})