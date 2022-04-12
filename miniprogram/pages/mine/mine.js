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
  onLoad: function() {
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
    this.setData({wxname:wxname})
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
guanyu() {       //关于北跳界面
  wx.navigateTo({
    url: '../guanyu/guanyu',
  })
},
测试1(){
  wx.navigateTo({
    url: '../ceshi1/ceshi1',   //切换页面的路径
  })
},
测试2(){
  wx.navigateTo({
    url: '../ceshi2/ceshi2',   //切换页面的路径
  })
},
ownupload(){
  wx.navigateTo({
    url: '../ownupload/ownupload',   //切换页面的路径
  })
},
sold(){
  wx.navigateTo({
    url: '../sold/sold',   //切换页面的路径
  })
},
guestbook(){
  wx.navigateTo({
    url: '../guestbook/guestbook',   //切换页面的路径
  })
},
})
