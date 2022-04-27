var demo = require("../../utils/utils")
// pages/index.js
Page({

   /**
      * 页面的初始数据
    */
    data: {
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        console.log(demo.formatTime(new Date(),"Y年M月D日"))
        console.log(demo.formatTime(new Date(),"Y-M-D h:m:s"))


        console.log(demo.formatTime(new Date(),"Y-M-D"))
        
        
        console.log(demo.formatTime(new Date(),"M-D"))
        console.log(demo.formatTime(new Date(),"h时m分s秒"))
        console.log(demo.formatTime(new Date(),"h时m分"))
        console.log(demo.formatTime(new Date(),"s秒"))
        console.log(demo.formatTime(new Date("2008-08-08 18:17:16"),"Y年M月D日 h时m分s秒"))
    },
})