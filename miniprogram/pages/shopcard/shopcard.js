// pages/shopcard/shopcard.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg',
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
        if(this.data.imgUrl != "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg"){
          this.setData({
            imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shopcardadd.jpg",
            tempFilePaths:'',
          })
          console.log("长按删除图片")
        }
        else{
          console.log("尚未上传图片")
        }
      },

      submit(){
        if(this.data.tempFilePaths.length == 0){
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
                        shopcardid:shopcardid
                    })
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
                  shopvalue:1
              }
          })
          .then(res => {
            wx.showModal({
                title: '提示',
                content:'保存成功！',
                showCancel:false,
                // success(res){
                //   console.log("保存成功，页面跳转")
                //   wx.switchTab({
                //     url: '../mine/mine',
                //   })
                // }
              })
              this.setData({
                  shopvalue:1
              })
              wx.setStorageSync('shopvalue',this.data.shopvalue)
          })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
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