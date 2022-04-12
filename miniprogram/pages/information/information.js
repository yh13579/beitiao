
import {
  getUserProfile
} from "../../utils/utils" 
Page({
    /**
     * 页面的初始数据
     */
    data: {

        show:false,    
        columns: ['男','女'],   
        gender:'',             //选择男女

        show2:false,
        columns2:['双能学院','软件学院','其他'], 
        department:'',         //选择院系

        signature:'',          //个性签名
        phone:'',             //11位手机号
        classroom:'',             //班级，如20机器人02班
        ownid:''                 //数据库中有用户记录，欲修改信息时获取id
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    findpeople(){
       wx.cloud.callFunction({
         name:'login',
       })
       .then(res => {
         wx.cloud.database().collection("information")
         .where({
           openid:res.result.openid
         })
         .get()
         .then(res =>{
           let phone = wx.getStorageSync('phone')
           let gender = wx.getStorageSync("gender")
           let department = wx.getStorageSync("department")
           let classroom = wx.getStorageSync("classroom")
           let ownid = wx.getStorageSync('ownid')
           if(res.data.length == 0){
             console.log("infomation中没有用户记录")
           }
           else if(phone.length == 0 || gender.length == 0 ||
            department.length == 0 || classroom.length == 0 || ownid.length == 0){
            console.log("information中有用户记录,但是用户删除了缓存,或Storage中的数据不完整")
            let ownid = res.data[0]._id
            let phone = res.data[0].phone
            let gender = res.data[0].gender
            let department = res.data[0].department
            let classroom = res.data[0].classroom
            let signature = res.data[0].signature
            this.setData({
              ownid:ownid,phone:phone,gender:gender,department:department,classroom:classroom,signature:signature
            }) 
            this.storage()
           }
         })
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
      let phone = wx.getStorageSync("phone")
      let gender = wx.getStorageSync("gender")
      let department = wx.getStorageSync("department")
      let classroom = wx.getStorageSync("classroom")
      let signature = wx.getStorageSync("signature")
      let ownid = wx.getStorageSync('ownid')
      if(phone.length != 0 && gender.length != 0 &&
        department.length != 0 && classroom.length != 0 && ownid.length != 0){
      console.log("有用户信息且信息完整")
      this.setData({phone:phone,gender:gender,department:department,classroom:classroom,signature:signature,ownid:ownid})
      }
      else{
        this.findpeople()
      }
     
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
    showPopup(e){      //点击选择性别，打开弹出层（选择器）
      this.hideKeyBorder()
      this.setData({show:true})
      },
   onClose() {       //点击空白处开闭弹出层（选择器）及选择器左上角的取消
      this.setData({ show: false });
    },
   onConfirm(e){     //选择器右上角的确定，点击确定获取值
     this.setData({
       gender:e.detail.value,
       show:false
     })
   },
   showPopupDepartment(e){
     this.hideKeyBorder()
     this.setData({show2:true})
   },
    onConfirm2(e){
      this.setData({
        department:e.detail.value,
        show2:false
      })
    },
    onClose2(){
      this.setData({show2:false})
    },
    getsignature(e){
      this.data.signature = e.detail
    },
    getgender(e){
      this.hideKeyBorder()
      this.data.gender = e.detail
    },
    getDepartment(e){
      this.hideKeyBorder()
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
    hideKeyBorder(){
      wx.hideKeyboard({
        success: (res) => {
          console.log(res)
        },
      })
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
          //用户曾经填写过信息，想要修改信息
          this.storage()  //将当前编辑完成的数据缓存
          wx.cloud.database().collection("information")
          .doc(this.data.ownid)
          .update({
            data:{
              userAvatarUrl: res.avatarUrl,  //用户头像
              userNickName: res.nickName,    //用户微信名
              phone: this.data.phone,        //手机号
              signature:this.data.signature,  //个性签名
              gender:this.data.gender,       //性别
              department:this.data.department, //院系
              classroom:this.data.classroom    //班级
            }
          })
          .then(res =>{
            wx.showModal({
              title: '提示',
              content:'保存成功！',
              showCancel:false,
              success(res){
                console.log("保存成功，页面跳转")
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
          this.storage()  //将当前编辑完成的数据缓存
          wx.cloud.database().collection("information")
          .add({
            data:{
              userAvatarUrl: res.avatarUrl,  //用户头像
              userNickName: res.nickName,    //用户微信名
              phone: this.data.phone,        //手机号
              signature:this.data.signature,  //个性签名
              gender:this.data.gender,       //性别
              department:this.data.department, //院系
              classroom:this.data.classroom,    //班级
            }
          })
          .then(res =>{
            wx.showModal({
              title: '提示',
              content:'保存成功！',
              showCancel:false,
              success(res){
                console.log("保存成功,页面跳转")
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
    storage(){          //数据缓存
      wx.setStorageSync('phone', this.data.phone)
      wx.setStorageSync('gender', this.data.gender)
      wx.setStorageSync('department', this.data.department)
      wx.setStorageSync('classroom', this.data.classroom)
      wx.setStorageSync('signature', this.data.signature)
      wx.setStorageSync('ownid', this.data.ownid)
    },
})