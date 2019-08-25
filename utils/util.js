function convertToStarsArray(stars){
  var num = stars.toString().substring(0,1)
  var arr = []
  for(var i=0; i<5; i++){
    if(i<num){
      arr.push[1]
    } else {
      arr.push[0]
    }
  }
  return arr
}

function http (url, callBack) {
  wx.request({
    url: url,
    methods: 'GET',
    header: {
      "content-type": "application/json"
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function () {
      console.log('failed')
    }
  })
}

function convertToCastString (data) {
  var casts = []
  for(var i in data){
    casts.push(data[i].name)
  }
  return casts.join('/')
}

function convertToCastInfos (data) {
  var castsArray = []
  for(var i in data){
    var cast = {
      img: data[i].avatars ? data[i].avatars.large : "",
      name: data[i].name
    }
    castsArray.push(cast)
  }
  return castsArray
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos

}