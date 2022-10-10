const db = wx.cloud.database();   
import {
  getUserProfile
} from "../../utils/utils" 
Page({
    /**
     * 页面的初始数据
     */
    data: {
        test:'',
        show:false,              //性别选择器（关闭）
        columns: ['男','女'],    //性别选择器
        gender:'',            
        show2:false,           //院系选择器（关闭）
        columns2:['双能学院','软件学院','其他'], 
        department:'',         //院系选择器
        signature:'',          //个性签名
        phone:'',             //11位手机号
        classroom:'',         //班级，如20机器人02班
        ownid:'' //数据库中有用户记录，欲修改信息时获取id
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.gettest()
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
    findpeople(){
      wx.cloud.callFunction({
          name:'login',
      })
       .then(res => {
       wx.cloud.database().collection("information")
       .where({
        _openid:res.result.userInfo.openId,  
       })
       .get()
       .then(res =>{
        if(res.data.length == 0){
         //console.log("infomation中没有用户记录")
        }
        else{
        //console.log("information中有用户记录,缓存中的数据不完整")
        //可以理解为换设备登录
        this.setData({
            phone:res.data[0].phone,
            gender:res.data[0].gender,
            department:res.data[0].department,
            classroom:res.data[0].classroom,
            signature:res.data[0].signature,
            ownid:res.data[0]._id
            }) 
        wx.setStorageSync('phone', this.data.phone)
        wx.setStorageSync('gender', this.data.gender)
        wx.setStorageSync('department', this.data.department)
        wx.setStorageSync('classroom', this.data.classroom)
        wx.setStorageSync('signature', this.data.signature)
        wx.setStorageSync('ownid', this.data.ownid)
           }
         })
       })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { 
    let phone = wx.getStorageSync("phone")
    let gender = wx.getStorageSync("gender")
    let department = wx.getStorageSync("department")
    let classroom = wx.getStorageSync("classroom")
    let signature = wx.getStorageSync("signature")
    let ownid = wx.getStorageSync('ownid')
      if(phone.length != 0 && gender.length != 0 &&
        department.length != 0 && classroom.length != 0 && ownid.length != 0){
      //console.log("有用户信息且信息完整")
      this.setData({
          phone:phone,
          gender:gender,
          department:department,
          classroom:classroom,
          signature:signature,
          ownid:ownid
        })
      }
      else{
        this.findpeople()
      }
     
    },
     /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
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
    showPopup(e){      //性别选择器
      this.setData({
          show:true
        })
      },
   onClose() {   //点击空白处开闭弹出层（选择器）及选择器左上角的取消
      this.setData({ 
          show: false 
        });
    },
   onConfirm(e){     //选择器右上角的确定，点击确定获取值
     this.setData({
       gender:e.detail.value,
       show:false
     })
   },
   showPopupDepartment(e){
     this.setData({
         show2:true
        })
   },
    onConfirm2(e){
      this.setData({
        department:e.detail.value,
        show2:false
      })
    },
    onClose2(){
      this.setData({
          show2:false
        })
    },
    getsignature(e){
      this.data.signature = e.detail
    },
    getgender(e){
      this.data.gender = e.detail
    },
    getDepartment(e){
      this.data.department = e.detail
    },
    getclassroom(e){
      this.data.classroom = e.detail
    },
    getPhone(e) {
      if (e.detail.length == 11) {
        this.setData({
          errorPhone: ""
        })
      }
      this.data.phone = e.detail
    },
    submit(){   
      getUserProfile().then(res => {
        if(this.data.phone.length != 11){
          this.setData({
            errorPhone: "请输入正确手机号"
          })
         }
         else if(
           this.data.gender.length == 0 ||
           this.data.department.length == 0 ||
           this.data.classroom.length == 0){
           wx.showModal({
             title: '提示',
             content:'请至少填写性别,院系和班级',
             showCancel:false
           })
         }
         else if(this.data.ownid.length != 0){
          //console.log("用户曾经填写过信息，想要修改信息")
          wx.setStorageSync('phone', this.data.phone)
          wx.setStorageSync('gender', this.data.gender)
          wx.setStorageSync('department', this.data.department)
          wx.setStorageSync('classroom', this.data.classroom)
          wx.setStorageSync('signature', this.data.signature)
          wx.cloud.database().collection("information")
          .doc(this.data.ownid)
          .update({
            data:{
              phone: this.data.phone,        
              signature:this.data.signature,  
              gender:this.data.gender,       
              department:this.data.department, 
              classroom:this.data.classroom    
            }
          })
          .then(res =>{
            wx.showModal({
              title: '提示',
              content:'保存成功！',
              showCancel:false,
              success(res){
                //console.log("保存成功，页面跳转")
                wx.switchTab({
                  url: '../mine/mine',
                })
              }
            })
          })
          .catch(err => {
            console.log(err)
          })
        }  
  else{
    wx.setStorageSync('phone', this.data.phone)
    wx.setStorageSync('gender', this.data.gender)
    wx.setStorageSync('department', this.data.department)
    wx.setStorageSync('classroom', this.data.classroom)
    wx.setStorageSync('signature', this.data.signature)
    wx.cloud.database().collection("information")
          .add({
            data:{
              userAvatarUrl: res.avatarUrl,  
              userNickName: res.nickName,  
              phone: this.data.phone,        
              signature:this.data.signature,  
              gender:this.data.gender,       
              department:this.data.department, 
              classroom:this.data.classroom,    
            }
          })
          .then(res =>{
            wx.showModal({
              title: '提示',
              content:'保存成功！',
              showCancel:false,
              success(res){
                //console.log("保存成功,页面跳转")
                wx.switchTab({
                  url: '../mine/mine',
                })
              }
            })
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
    },
})