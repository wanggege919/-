var app = getApp()
var util = require("../../utils/util.js")
Page({
  onLoad: function (options) {
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
        console.log("fail")
      }
    })
  },
  processDoubanData: function (data, settedKey, categoryTitle){
    var moviesData = []
    for(var i in data.subjects){
      var title = data.subjects[i].title
      if(title.length > 6){
        title = title.substring(0,6) + "..."
      }
      var movieData = {
        stars: util.convertToStarsArray(data.subjects[i].rating.stars),
        cover: data.subjects[i].images.large,
        title: title,
        score: data.subjects[i].rating.average
      }
      moviesData.push(movieData)
    }
    var settedData = {}
    settedData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: moviesData
    }
    this.setData(settedData)
  }
})