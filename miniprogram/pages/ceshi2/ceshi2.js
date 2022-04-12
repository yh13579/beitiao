// pages/ceshi2/ceshi2.js
import {
    getUserProfile
  } from "../../utils/utils"
var idx
var taskList
Page({
    
    /**
     * 页面的初始数据
     */
    data: {
        comment:'',
        idx: 0, 
        taskList: ["A","B","C"],
    },
    selectIdx: function(e){
        idx= e.currentTarget.dataset.idx;
        this.setData({
         idx,
        })
        console.log(idx)
        console.log(e.currentTarget.dataset.idx)
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
    },
    getcomment(e){
        this.data.comment = e.detail
    },
    comment(){
        console.log("评论功能")
    },
    ceshi2(){
        let timestamp = Date.parse(new Date()) / 1000
        let shenhetimestamp = timestamp-18000
        console.log(timestamp)
        console.log(shenhetimestamp)
        var arr = [2,2,5,6,3,4,4,0,1,4,8,8];
         arr = Array.from(new Set(arr));
         console.log(arr);// [2, 5, 6, 3, 4, 0, 1, 8]
    }

})