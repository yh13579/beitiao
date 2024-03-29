const db = wx.cloud.database();   
import {
  getUserProfile
} from "../../utils/utils"  
var demo = require("../../utils/utils_time")
Page({ 
    /**
     * 页面的初始数据 
     */
    data: {   
        information_data:'',
        test:'',
        columns: ['生活用品','学习用品','休闲食品','休闲玩物','美妆护肤','电子设备','药物','其他'],   
        state: -1,
        tempFilePaths: "",    //要上传的文件的小程序临时文件路径
        imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
        goodname:'',
        phone:'',
        gooddetail:'',
        goodprice:'',
        category:'',
        ownlistlength:''
    },
    haha(){
        wx.showModal({
            title: '提示',
            content:'作者正在努力改bug中...下次再过来吧~',
            showCancel:false
          })
      },
    getPhoto() { 
        wx.chooseMedia({ 
          count: 1,
          mediaType:['image'],
          sourceType:['album', 'camera'],
          sizeType: ['original', 'compressed'],
          success: res => {
            // tempFilePath可以作为img标签的src属性显示图片
            this.data.tempFilePaths = res.tempFiles[0].tempFilePath
                   this.setData({
                     imgUrl: res.tempFiles[0].tempFilePath
                   })
                   wx.showToast({
                       icon: "none",
                       title: "长按可删除图片.."
                     })
                 }
        })
      },

      getgoodname(e){
        this.data.goodname = e.detail
      },
      getPhone(e) {
        if (e.detail.length == 11) {
          this.setData({
            errorPhone: ""
          })
        }
        this.data.phone = e.detail
      },
      getgoodprice(e){
        this.data.goodprice = e.detail
      },
      getgooddetil(e){
        this.data.gooddetail = e.detail
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
      this.getTabBar().setData({
        active : 1
      })
      this.gettest()
      let admin = wx.getStorageSync('admin')
      this.setData({
          admin:admin
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
        this.judgement_infomation()
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
    longpress(){
      if(this.data.imgUrl != "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg"){
        this.setData({
          imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
          tempFilePaths:'',
        })
        //console.log("长按删除图片")
      }
    //   else{
    //     //console.log("尚未上传图片")
    //   }
    },
    judgement_infomation(){ 
        wx.cloud.callFunction({
            name:'login',
        })
        .then(res =>{
            wx.cloud.database().collection("information")
        .where({
            _openid:res.result.userInfo.openId,  
           })
           .get()
           .then( res =>{
               this.setData({
                   information_data:res.data.length
               })
               //console.log(this.data.information_data)
           })
           .catch(err => {
            console.log(err)
          })
        })
    },
    uploadImg() {
      let timestamp = Date.parse(new Date()) / 1000
      let date = demo.formatTime(new Date(),"Y-M-D")
      getUserProfile().then(res =>{ 
        wx.showLoading({
          title: '加载中',
          mask: true
        })   
        wx.cloud.uploadFile({
          cloudPath: timestamp.toString(),
          filePath:this.data.tempFilePaths
        })
        .then(res => {
          let avatarUrl = wx.getStorageSync("avatarUrl")
          let nickName = wx.getStorageSync("nickName")
          wx.cloud.database().collection('goods')
              .add({
                data: { 
                  userAvatarUrl: avatarUrl,  
                  userNickName: nickName,  
                  imgUrl: res.fileID,
                  createTime: timestamp, 
                  goodname:this.data.goodname,
                  gooddetail:this.data.gooddetail,
                  goodprice:"¥"+this.data.goodprice,
                  category:this.data.category,
                  phone:this.data.phone,
                  date:date,
                  audit:-1,
                  state:this.data.state,
                  reject_count:0
                }
              })
              .then(res => {
                wx.hideLoading() 
                wx.showModal({
                  title: '提示',
                  content: '上传成功,等待管理员审核完成即可上架',
                  showCancel:false,
                })
                this.setData({
                  imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
                  tempFilePaths: "", 
                  goodname:'',
                  gooddetail:'',
                  goodprice:'',
                  category:'',
                  state:-1
                })
              })
              .catch(err => {
                console.log(err)
              })
        }).catch(err => {
          console.log(err)
        })
      })
    },
    uploadGood(event) {
        //this.judgement_infomation()
        this.getownlist()
        if(this.data.information_data < 1){
            wx.showModal({
                title: '提示',
                content: '请先登录和完善个人信息' ,
                showCancel:false
              })
        }
        else if(this.data.phone.length != 11 || this.data.phone[0] != 1){
          this.setData({
        errorPhone: "输入必须是11位数字开头为1的手机号"
          })
         }
        else if(this.data.gooddetail.length == 0 ||
            this.data.goodname.length == 0 || 
            this.data.goodprice.length == 0 ||
            this.data.tempFilePaths == "" ||
            this.data.category.length == 0){
              wx.showModal({
                title: '提示',
                content: '请上传完整信息' ,
                showCancel:false
              })
            }
            else if(this.data.ownlistlength > 15 && this.data.admin == 0){
              wx.showModal({
                title: '提示',
                content: '普通用户最多上传15件物品("已上架","审核中","未通过","已卖出"物品的总和)' 
              })
            }
            else if(this.data.goodprice > 1000 || this.data.goodprice.length >= 7 || isNaN(this.data.goodprice)){
              wx.showModal({
                title: '提示',
                content: '物品售价不科学' 
              })
              this.setData({
                  goodprice:''
              })
            }
         else {
          this.uploadImg(this.data.tempFilePaths[0]) 
        }
    },
    getownlist(){ 
      wx.cloud.callFunction({  
          name: 'login',
        })
        .then( res =>{
          wx.cloud.database().collection('goods')
          .where({
            _openid:res.result.userInfo.openId,  
          })
          .get()
          .then(res => {
             this.setData({
               ownlistlength:res.data.length
             })
          })
          .catch(err => {
              console.log(err)
          })
        })
  },
  columndetail(event){ 
    let index = event.currentTarget.dataset.index
    let column = this.data.columns[index]
    this.setData({   
        state: event.currentTarget.dataset.index,
        category:column
      });
  },
})