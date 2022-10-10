const db = wx.cloud.database();   
Page({
    /**
     * 页面的初始数据
     */
    data: {
        test:''
    },
    gettest(){     //获取test的值
        //console.log("获取test的值")
        db.collection('announcement')
        .doc("d2fe6f206243305802f9420737d78698")
        .get()
        .then(res => {
          this.setData({
            test:res.data.test
          })
        })
      },
    zan(){
        wx.showToast({
            icon: "none",
            title: "感谢认可.."
          })
    },
    cai(){
        wx.showToast({
            icon: "none",
            title: "无效的操作"
          })
    },
    goto_modediu(){
        wx.navigateToMiniProgram({
          appId: 'wx195ae5141b524323',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.gettest()
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
    }
})