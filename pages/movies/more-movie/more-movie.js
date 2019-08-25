var app = getApp()
var util = require('../../../utils/util.js')
Page({
  data: {
    movies: [],
    navigateTitle: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function(options) {
    // 页面初始化，options为页面跳转所带来的参数
    var category = options.id
    this.data.navigateTitle = category
    var dataUrl = ''
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters"
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon"
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/top250"
        break;
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDoubanData)
  },
  processDoubanData: function (moviesDouban) {
    var movies = []
    for (var i = 0; i < moviesDouban.subjects.length; i++) {
      var subject = moviesDouban.subjects[i]
      var title = subject.title
      if (title.length > 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    // 如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    var totalMovies = []
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    })
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
    this.data.totalCount += 20
  },
  // 上滑触底加载更多数据
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  // 下拉刷新加载数据
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    this.data.movies = []
    this.data.isEmpty = true
    this.data.totalCount = 0
    util.http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onReady: function() {
    // 设置动态导航栏，动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }

})