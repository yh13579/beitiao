import {
    getUserProfile
  } from "../../utils/utils"
Page({
    /**  
     * 页面的初始数据
     */
    data: {
        detailid:'',
        phone:'',
        gooddetail:'',
        goodname:'',
        goodprice:'',
        nickName:'',
        avatarUrl:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.detailid = options.id
        this.getId(options.id)
    },

    shop_card(){
        wx.showToast({
            icon: "none",
            title: "功能完善中.."
          })
    },
    
    phone(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
      success: function () {        
        console.log("拨打电话成功！")      
      },      
      fail: function (e) {         
        console.log(e)     
        console.log("用户取消")  
      }
    })
  },
  bigImg() { 
    wx.previewImage({
      urls: [this.data.imgUrl],
    })
  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },
    getId(id) {     // 根据id查询数据库good 
        wx.cloud.database().collection("goods")
          .doc(id)
          .get()
          .then(res => {
            this.setData({
              imgUrl: res.data.imgUrl,
              phone:res.data.phone,
              gooddetail:res.data.gooddetail,
              goodprice:res.data.goodprice,
              goodname:res.data.goodname,
              nickName:res.data.userNickName,
              avatarUrl:res.data.userAvatarUrl
            })
          })
          .catch(err => {
            console.log(err)
          })
      },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    },
})