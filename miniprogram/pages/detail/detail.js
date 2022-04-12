// pages/detail/detail.js
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
        comment:'',
        commentsList: [],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.detailid = options.id
        this.getId(options.id)
        this.commentfind(options.id)
        let admin = wx.getStorageSync('admin')
        this.setData({
          admin: admin
        })
    },
      // 根据id查询数据库good 
  phone(event){
    console.log(event)
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
      success: function () {        
        console.log("拨打电话成功！")      
      },      
      fail: function (e) {         
        console.log(e)      
      }
    })
    console.log(this.data.phone)
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

    handleLongPress(e) {
      let id = e.currentTarget.dataset.id
      console.log(id)
      console.log(this.data.admin)
      if(this.data.admin == 1){
        wx.showModal({
          title: '删除该评论？',
          success(res){
            if(res.confirm){
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

    commentfind(id) {       //查找此id下的所有评论
      let length = this.data.commentsList.length
      wx.cloud.database().collection('comment')
        .where({
          detailid: id
        })
        .orderBy("createTime", "desc")
        .skip(length)
        .limit(5)
        .get()
        .then(res => {
          let len = res.data.length
          this.setData({
            commentsList: this.data.commentsList.concat(res.data)
          })
        })
    },

    getId(id) {
        wx.cloud.database().collection("goods")
          .doc(id)
          .get()
          .then(res => {
            this.setData({
              imgUrl: res.data.imgUrl,
              phone:res.data.phone,
              gooddetail:res.data.gooddetail
            })
          })
          .catch(err => {
            console.log(err)
          })
      },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    comment(){ 
      if(this.data.comment.length == 0){
        wx.showModal({
          title: '提示',
          content:'评论不能为空',
          showCancel:false,
        })
      }
      else{
        console.log("检测到输入内容")
        getUserProfile().then(res => {
            let timestamp = Date.parse(new Date()) / 1000
            let date = new Date().toLocaleDateString()
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
                  userAvatarUrl: res.avatarUrl,  //用户头像
                  userNickName: res.nickName,    //用户微信名
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
})