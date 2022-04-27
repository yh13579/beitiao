import {
  getUserProfile
} from "../../utils/utils"  
var demo = require("../../utils/utils_time")
Page({ 
    /**
     * 页面的初始数据 
     */
    data: {   
        columns: ['生活用品','学习用品','休闲食品','休闲玩物','美妆护肤','电子设备','药物','其他'],   
        state: '',
        tempFilePaths: "",    //要上传的文件的小程序临时文件路径
        imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
        goodname:'',
        phone:'',
        gooddetail:'',
        goodprice:'',
        category:'生活用品',
        ownlistlength:''
    },
    getPhoto() { 
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: res => {
            // tempFilePath可以作为img标签的src属性显示图片
            this.data.tempFilePaths = res.tempFilePaths
            this.setData({
              imgUrl: res.tempFilePaths
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { 
      this.getTabBar().setData({
        active : 1
      })
      let admin = wx.getStorageSync('admin')
      this.setData({
          admin:admin
        })
        console.log(demo.formatTime(new Date(),"Y-M-D"))
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
    longpress(){
      if(this.data.imgUrl != "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg"){
        this.setData({
          imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
          tempFilePaths:'',
        })
        console.log("长按删除图片")
      }
      else{
        console.log("尚未上传图片")
      }
    },
    uploadImg(temFile) {
      let timestamp = Date.parse(new Date()) / 1000
      let date = demo.formatTime(new Date(),"Y-M-D")
      getUserProfile().then(res =>{ 
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.cloud.uploadFile({
          cloudPath: timestamp.toString(),
          filePath: temFile, 
        })
        .then(res => {
          let avatarUrl = wx.getStorageSync("avatarUrl")
          let nickName = wx.getStorageSync("nickName")
          wx.cloud.database().collection('goods')
              .add({
                data: { 
                  userAvatarUrl: avatarUrl,  //用户头像
                  userNickName: nickName,  //用户微信名
                  imgUrl: res.fileID,
                  createTime: timestamp, 
                  goodname:this.data.goodname,
                  gooddetail:this.data.gooddetail,
                  goodprice:"¥"+this.data.goodprice,
                  category:this.data.category,
                  phone:this.data.phone,
                  date:date,
                  audit:-1,
                }
              })
              .then(res => {
                wx.hideLoading() 
                wx.showModal({
                  title: '提示',
                  content: '上传成功,等待管理员审核完成即可上架',
                })
                this.setData({
                  imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/add.jpg",
                  tempFilePaths: "", 
                  goodname:'',
                  gooddetail:'',
                  goodprice:'',
                  category:this.data.category
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
        this.getownlist()
        if(this.data.phone.length != 11){
          this.setData({
            errorPhone: "请输入正确手机号"
          })
         }
        else if(this.data.gooddetail.length == 0 ||
            this.data.goodname.length == 0 || 
            this.data.goodprice.length == 0 ||
            this.data.tempFilePaths == "" ||
            this.data.category.length == 0){
              wx.showModal({
                title: '提示',
                content: '请上传完整信息' 
              })
            }
            else if(this.data.ownlistlength > 10 && this.data.admin == 0){
              wx.showModal({
                title: '提示',
                content: '普通用户最多上传10件物品' 
              })
            }
            else if(this.data.goodprice > 1000 || this.data.goodprice.length >= 7 || isNaN(this.data.goodprice)){
              wx.showModal({
                title: '提示',
                content: '物品售价不科学' 
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
              openid:res.result.openid,
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