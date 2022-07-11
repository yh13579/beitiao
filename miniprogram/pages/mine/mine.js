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
    if(this.data.shopvalue.length == 0){
        console.log("没有shopvalue")
        this.find_shopvalue()
    }
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
    if(this.data.AvatarUrl == "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg"){
        this.judgment()  
        return
    }     
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
    wx.cloud.callFunction({
        name:'login',
    })
    .then(res =>{
        wx.cloud.database().collection("information")
    .where({
        _openid:res.result.userInfo.openId,  
       })
       .get()
       .then( res =>{
           this.setData({
               information_data:res.data.length
           })
           if(this.data.information_data < 1 || this.data.name_avatar == -1){
            wx.showToast({
                icon: "none", 
                title: "请先登录和完善个人信息"  
              })
        }
        else{
            wx.navigateTo({  
                url: '../shopcard/shopcard',  
              })
           }
       })
       .catch(err => {
        console.log(err)
      })
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

refresh(){
    wx.setStorageSync('avatarUrl','')
    wx.setStorageSync('nickName', '')
    getUserProfile().then(res => {
        this.onShow()
    })
    this.onShow()
},

unlogin(){
    if(this.data.AvatarUrl == "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg"){
        getUserProfile().then(res => {
            this.onShow()
        })
    }
},
find_shopvalue(){
    wx.cloud.callFunction({
        name:'login',
    })
    .then(res => {
        wx.cloud.database().collection("information")
        .where({
            _openid:res.result.userInfo.openId,
        })
        .get()
        .then(res => {
           if(res.data.length == 0){  
               console.log("没有用户记录，基本信息都没有")
           }
           else if(res.data[0].shopvalue == undefined || res.data[0].shopvalue == 0){
               console.log("数据库没有shop值，或者shop值为''")
           }
           else{
               console.log("数据库中有用户信息，且shopvalue值完整")
                this.setData({
                    shopvalue:res.data[0].shopvalue
                })
                wx.setStorageSync('shopvalue', this.data.shopvalue)
           }
        })
    })
}
})
