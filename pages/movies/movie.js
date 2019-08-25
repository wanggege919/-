var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    inputValue: '',
    containerShow: true,
    searchPanelShow: false
  },
  onLoad: function () {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3"
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3"
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3"
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "豆瓣Top250")
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this
    wx.request({
      url: url,
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function () {
        console.log('failed')
      }
    })
  },
  // 处理豆瓣数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
    var movies = []
    for (var i = 0; i < moviesDouban.subjects.length; i++ ){
      var subject = moviesDouban.subjects[i]
      var title = subject.title
      if(title.length > 6){
        title = title.substring(0,6) + "..."
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
    var readyData = {}
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)   
  },
  // 跳转到更多页面
  onMoreTap: function(event){
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?id=' + category,
    })
  },
  // 搜索框聚焦触发
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  // 取消搜索页面
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      inputValue: '',
      searchResult: {}
    })
  },
  // 搜索框失去焦点触发
  onBindBlur: function (event) {
    this.inputValue = event.detail.value
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + this.inputValue
    if (this.inputValue){
      this.getMovieListData(searchUrl, 'searchResult', '')
    }
  },
  // 跳转到电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  }
})