
var postsData = require('../../../data/posts-data.js')
var appData = getApp() // 拿到全局的 appData 对象
Page({
  data: {
    isPlayingMusic: false
  },

  onLoad: function(options) {
    // var globalData = appData.globalData
    // console.log(globalData)
    var postId = options.id
    this.data.currentId = postId
    var postData = postsData.postList[postId]
    this.setData(postData)
    // 初始化缓存
    var postsCollected = wx.getStorageSync("posts_collected")
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      if (postCollected) {
        this.setData({
          collect: postCollected
        })
      }
    } else {
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync("posts_collected", postsCollected)
    }
    if (appData.globalData.g_isPlayingMusic && appData.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor()
  },
 // 设置音乐监听
  setMusicMonitor: function () {
    // 监听音乐播放
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isPlayingMusic: true
      })
      appData.globalData.g_isPlayingMusic = true
      appData.globalData.g_currentMusicPostId = this.data.currentId
    })
    
    // 监听音乐暂停
    wx.onBackgroundAudioPause(() => {
      this.setData({
        isPlayingMusic: false
      })
      appData.globalData.g_isPlayingMusic = false
      appData.globalData.g_currentMusicPostId = null
    })
    // 监听音乐停止
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlayingMusic: false
      })
      appData.globalData.g_isPlayingMusic = false
      appData.globalData.g_currentMusicPostId = null
    })
  },

  onCollectionTap: function(event) {
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentId]
    postCollected = !postCollected
    postsCollected[this.data.currentId] = postCollected
    this.showToast(postsCollected, postCollected)
  },

  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync("posts_collected", postsCollected)
    this.setData({
      collect: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000
    })
  },

  onShareTap: function (event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "用户是否取消" + res.cancel
        })
      }
    })
  },
  onMusicTap: function () {
    var isPlayingMusic = this.data.isPlayingMusic
    var currentId = this.data.currentId
    if(isPlayingMusic){
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentId].music.url,
        title: postsData.postList[currentId].music.title,
        coverImgUrl: postsData.postList[currentId].music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
    
   
  }


  // showModal: function(postsCollected, postCollected) {
  //   var that = this
  //   wx.showModal({
  //     title: '收藏',
  //     content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
  //     showCancel: true,
  //     cancelText: '取消',
  //     cancelColor: '#333',
  //     confirmText: '确认',
  //     confirmColor: 'blue',
  //     success: function(res) {
  //       if (res.confirm) {
  //         wx.setStorageSync("posts_collected", postsCollected)
  //         that.setData({
  //           collect: postCollected
  //         })
  //       }
  //     }
  //   })
  // },

  


})