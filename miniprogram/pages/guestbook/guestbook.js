var demo = require("../../utils/utils_time")
import {
    getUserProfile  
  } from "../../utils/utils" 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comment:'',
        commentsList: [],
        idx:0
    },
    comment(){
        if(this.data.comment.length == 0){
          wx.showModal({
            title: '提示',
            content:'评论不能为空',
            showCancel:false,
          })
        }
        else if(this.data.comment.length>50){
            console.log(this.data.comment.length)
            wx.showModal({
                title: '提示',
                content:'评论内容过长',
                showCancel:false,
              })
        }
        else{
          console.log("检测到输入内容")
          getUserProfile().then(res => {
              let timestamp = Date.parse(new Date()) / 1000
              let date = demo.formatTime(new Date(),"Y-M-D h:m")
              let commentObj = {
                comment: this.data.comment,
                userAvatarUrl: res.avatarUrl,
                userNickName: res.nickName, 
                date:date,
                createTime:timestamp
              }
              wx.cloud.callFunction({
                name:"msgSecCheck",
                data:{
                  comment:this.data.comment
                }
              }).then(check => {
                wx.cloud.database().collection("comment")
                .add({
                  data:{
                    userAvatarUrl: res.avatarUrl,  
                    userNickName: res.nickName,    
                    detailid:this.data.detailid,
                    comment:this.data.comment,
                    date:date,
                    createTime:timestamp
                  }
                })
                .then(res =>{ 
                  wx.showModal({
                    title: '提示',
                    content:'评论成功！',
                    showCancel:false,
                  })
                  this.data.commentsList.unshift(commentObj)
                  this.setData({
                    commentsList:this.data.commentsList,
                    comment:''
                  })
                })
                .catch(err => {
                  console.log(err)
                })
              })
          })
        }
    },
    getcomment(e){
        this.setData({comment:e.detail.value});
    },
    commentfind() {  
        let length = this.data.commentsList.length
        wx.cloud.database().collection('comment')
          .orderBy("createTime", "desc")
          .skip(length)
          .get()
          .then(res => {
            
            this.setData({
              commentsList: this.data.commentsList.concat(res.data)
            })
          })
      },
      handLongPress(e) {
        let id = e.currentTarget.dataset.id
        let idx = e.currentTarget.dataset.idx
        console.log(this.data.admin)
        if(this.data.admin == 1){
          wx.showModal({
            title: '删除该评论？',
            success:res  => {
              if(res.confirm){
                var commentsList = this.data.commentsList
                commentsList.splice(idx,1)
                this.setData({
                  commentsList: commentsList,
                })
                wx.cloud.database().collection("comment")
                .doc(id)
                .remove()
                .then(res=>{
                  console.log("删除成功",res)
                })
                .catch(res=>{
                  console.error("删除失败",res)
                })
              }else{
                console.log("已取消")
              }
            }
          })
        }
        else{
          console.log("非管理员")
        }
        },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.commentfind()
        let admin = wx.getStorageSync('admin')
        this.setData({
          admin: admin
        })
        console.log(demo.formatTime(new Date(),"Y-M-D h:m"))
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
        this.setData({
            commentsList:[]
        })
        this.commentfind()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.commentfind()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})