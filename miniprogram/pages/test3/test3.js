var demo = require("../../utils/utils_time")
Page({
   /**
      * 页面的初始数据
    */
    data: {
        showConfirm:false,
        reason:''   
    },
    reason_input(e){
        this.setData({
          reason: e.detail.value
        })
      },
      cancel(){
        this.setData({
          showConfirm: false,
          reason:''
        })
        console.log("用户取消")
      },
      reject_confirm(){
        this.setData({
          showConfirm: false,
        })
        console.log("用户点击确定")
        console.log(this.data.reason)
      },







      
	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
    },
})