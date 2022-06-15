// pages/shopcard/shopcard.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imgUrl:'',
        tempFilePaths:'',
        shopcardid:'',
        shopvalue:''
    },
    getPhoto() { 
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: res => {
            // tempFilePath可以作为img标签的src属性显示图片
            this.data.tempFilePaths = res.tempFilePaths
            this.setData({
              imgUrl: res.tempFilePaths
            })
          }
        })
      },

      longpress(){
        wx.showActionSheet({
          itemList: ['查看大图','删除图片'],
          success:res =>{
              if(this.data.imgUrl == "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg"){
                wx.showToast({
                    icon: "none",
                    title: "你没有上传任何图片"
                  })
              }
               else if(res.tapIndex == 1){
                  console.log("点击的是删除图片")
                  this.setData({
                    imgUrl:"cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg",
                    tempFilePaths:''
                  })
                  wx.setStorageSync('shopvalue',0)
                  wx.setStorageSync('shop_card','')
                  let shopvalue = wx.getStorageSync('shopvalue')
                  this.setData({
                      shopvalue:shopvalue
                  })
                console.log(this.data.shopvalue)
                wx.cloud.callFunction({
                    name:"login",
                })
                .then(res => {
                    wx.cloud.database().collection("information")
                    .where({
                        _openid:res.result.userInfo.openId,
                    })
                    .get()
                    .then(res => {
                        let shopcardid = res.data[0]._id
                        this.setData({
                            shopcardid:shopcardid
                        })
                        console.log("现在的shopvalue是：",this.data.shopvalue)
                       wx.cloud.database().collection("information")
                       .doc(this.data.shopcardid)
                       .update({
                           data:{
                               shop_card:'',
                               shopvalue:this.data.shopvalue
                           }
                       })
                       .then(res => {
                        wx.setStorageSync('shopvalue',this.data.shopvalue)
                        wx.setStorageSync('shop_card',this.data.tempFilePaths[0])
                       })
                    })
                })
              }
              else{
                  let shopvalue = wx.getStorageSync('shopvalue')
                  this.setData({
                      shopvalue:shopvalue
                  })
                  console.log("点击的是查看大图")
                  if(this.data.shopvalue == 1){
                    wx.previewImage({
                        urls: [this.data.imgUrl],
                      })
                  }
                  else{
                    wx.previewImage({
                        urls: [this.data.imgUrl[0]],
                      })
                  }
              }
          },
          fail:function(res){
              console.log("没有操作")
          }
        })
      },

      submit(){
        if(this.data.tempFilePaths.length == 0 && this.data.imgUrl != "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg"){
            wx.showToast({
                icon: "none",
                title: "此名片你正在使用中.."
              })
              return
        }
        else if(this.data.tempFilePaths.length == 0){
            wx.showModal({
                title: '提示',
                content:'请上传二维码图片',
                showCancel:false
              })
              return
        }
            wx.cloud.callFunction({
                name:"login",
            })
            .then(res => {
                console.log(res.result.userInfo.openId)
                wx.cloud.database().collection("information")
                .where({
                    _openid:res.result.userInfo.openId,
                })
                .get()
                .then(res =>{
                    let shopcardid = res.data[0]._id
                    console.log(shopcardid)
                    this.setData({
                        shopcardid:shopcardid,
                        shopvalue:1
                    })
                    console.log("现在的shopvalue是：",this.data.shopvalue)
                    this.find()
                })
            })
      },
      find(){  
          console.log("根据上传的商家名片，存储到数据库")
          wx.cloud.database().collection("information")
          .doc(this.data.shopcardid)
          .update({
              data:{
                  shop_card:this.data.tempFilePaths[0],
                  shopvalue:this.data.shopvalue
              }
          })
          .then(res => {
            wx.showModal({
                title: '提示',
                content:'保存成功！',
                showCancel:false,
                success(res){
                  console.log("保存成功，页面跳转")
                  wx.switchTab({
                    url: '../mine/mine',
                  })
                }
              })
            wx.setStorageSync('shopvalue',this.data.shopvalue)
            wx.setStorageSync('shop_card',this.data.tempFilePaths[0])
          })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let shop_card= wx.getStorageSync('shop_card')
        if(shop_card.length != 0){
            console.log("存储的有shop_card的值")
            this.setData({
            imgUrl:shop_card  
        })
        }
        else{
            console.log("无shop_card的值，尚未上传名片")
            this.setData({
                imgUrl:"cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg"
            })
        }
        
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() { 
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
    }
})