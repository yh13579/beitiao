import {
    getUserProfile
  } from "../../utils/utils"  
Page({
  /**
   * 页面的初始数据
   */
  data: {  
    AvatarUrl:'',
    wxname:'',
    name_avatar:'',
    shopvalue:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(){ 
    this.getTabBar().setData({
      active : 2
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    let shopvalue = wx.getStorageSync('shopvalue')
    this.setData({
        shopvalue:shopvalue
    })
    let wxname = wx.getStorageSync('nickName')
    let AvatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({
        wxname:wxname
    })
    if(this.data.wxname.length == 0){
      this.setData({
        wxname:"未登录",   
        AvatarUrl:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg',
        name_avatar:-1
      })
    }
    else{
      this.setData({
        wxname:wxname,
        AvatarUrl:AvatarUrl,
        name_avatar:1
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
  },
Information() {       
  wx.navigateTo({
    url: '../information/information',
  })
  },
  ownupload(){ 
    if(this.data.AvatarUrl == "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg"){
        this.judgment()  
        return
    }
    wx.navigateTo({
      url: '../ownupload/ownupload',   
    })
  },
  sold(){   
    if(this.data.AvatarUrl == "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg"){
        this.judgment()  
        return
    }        
    wx.navigateTo({
      url: '../sold/sold',   
    })
  },
concerning() {       
  wx.navigateTo({
    url: '../concerning/concerning',
  })
},
guestbook(){        
  wx.navigateTo({
    url: '../guestbook/guestbook',  
  })
},
shopcard(){
    if(this.data.name_avatar == -1){
        wx.showToast({
            icon: "none",
            title: "尚未登录,请先登录.."
          })
        return 
    }
    wx.navigateTo({  
        url: '../shopcard/shopcard',  
      })
},

judgment(){
        wx.showModal({
            title: '提示',
            content:'该功能在登录之后开放',
            showCancel:false,
            success:res => {
            getUserProfile().then(res => {
                this.onShow()
            })
          }
        })
},

/*  更新登录按钮 ，尚待处理*/
refresh(){
    // let temp_avatarUrl = wx.getStorageSync('avatarUrl')
    // let temp_nickName = wx.getStorageSync('nickName')
    // wx.setStorageSync('avatarUrl','')
    // wx.setStorageSync('nickName', '')
    getUserProfile().then(res => {
        this.onShow()
        console.log(res)
        console.log(res.avatarUrl)
        console.log(res.nickName)
    //    if(res.avatarUrl == temp_avatarUrl && res.nickName == temp_nickName){
    //        console.log("并没有更换头像和昵称")
    //    }
    //    else{
    //        this.onShow()
    //    }
        //this.onShow()
    })
},


refresh_login(){
    if(this.data.AvatarUrl == "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg"){
        getUserProfile().then(res => {
            this.onShow()
        })
    }
}
})
