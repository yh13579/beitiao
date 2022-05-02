// pages/shopcard/shopcard.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg',
        tempFilePaths:''
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
        if(this.data.imgUrl != "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg"){
          this.setData({
            imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
            tempFilePaths:'',
          })
          console.log("长按删除图片")
        }
        else{
          console.log("尚未上传图片")
        }
      },
      submit(){
        wx.showModal({
          title: '提示',
          content:'功能尚未完善',
          showCancel:false
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