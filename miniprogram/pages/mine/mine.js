Page({
  /**
   * 页面的初始数据
   */
  data: {
    AvatarUrl:'',
    wxname:''
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
    let wxname = wx.getStorageSync('nickName')
    let AvatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({
        wxname:wxname
    })
    if(this.data.wxname.length == 0){
      this.setData({
        wxname:"尚未完善个人信息",
        AvatarUrl:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/moren.jpg'
      })
    }
    else{
      this.setData({
        wxname:wxname,
        AvatarUrl:AvatarUrl
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
Information() {       //个人信息界面
  wx.navigateTo({
    url: '../information/information',
  })
  },
  ownupload(){        //我的发布界面
    wx.navigateTo({
      url: '../ownupload/ownupload',   
    })
  },
  sold(){             //我的交易界面
    wx.navigateTo({
      url: '../sold/sold',   
    })
  },
concerning() {       //关于北跳界面
  wx.navigateTo({
    url: '../concerning/concerning',
  })
},
guestbook(){        //留言板界面
  wx.navigateTo({
    url: '../guestbook/guestbook',  
  })
},
})
