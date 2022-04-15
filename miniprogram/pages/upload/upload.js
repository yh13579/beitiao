import {
  getUserProfile
} from "../../utils/utils" 
Page({
    /**
     * 页面的初始数据 
     */
    data: { 
        tempFilePaths: "",    //要上传的文件的小程序临时文件路径
        imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/newadd.jpg",
        show:false,    
        columns: ['生活用品','学习用品','休闲食品','休闲玩物','美妆护肤','电子设备','药物','其他'],   
        fileId: "",
        goodname:'',
        phone:'',
        gooddetail:'',
        goodprice:'',
        category:'',
        ownlistlength:''
    },
  showPopup(e){      //点击选择，打开弹出层（选择器）
    this.hideKeyBorder()
    this.setData({show:true})
      },
   onClose() {//点击空白处开闭弹出层（选择器）及选择器左上角的取消
      this.setData({ show: false });
    },
   onConfirm(e){    //选择器右上角的确定，点击确定获取值
     this.setData({
       category:e.detail.value,
       show:false
     })
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
      getcategory(e){
        this.hideKeyBorder()
        this.data.category = e.detail
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
      this.setData({admin:admin})
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
    hideKeyBorder() {
      wx.hideKeyboard({
        success: (res) => {
          console.log(res)
        },
      })
    },
    longpress(){
      if(this.data.imgUrl != "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/newadd.jpg"){
        this.setData({
          imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/newadd.jpg",
          tempFilePaths:''
        })
        console.log("长按删除图片")
      }
      else{
        console.log("尚未上传图片")
      }
    },
    uploadImg(temFile) {
      getUserProfile().then(res =>{
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        let timestamp = Date.parse(new Date()) / 1000
        let date = new Date().toLocaleDateString()
        wx.cloud.uploadFile({
          cloudPath: timestamp.toString(),
          filePath: temFile,
        })
        .then(res => {
          wx.cloud.database().collection('goods')
              .add({
                data: { 
                  userAvatarUrl: res.avatarUrl,  //用户头像
                  userNickName: res.nickName,    //用户微信名
                  //异步问题，无法获取到头像和微信名
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
                  content: '上传成功',
                })
                this.setData({
                  imgUrl: "cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/newadd.jpg",
                  tempFilePaths: "", 
                  goodname:'',
                  gooddetail:'',
                  goodprice:'',
                  category:''
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
            }else if(this.data.ownlistlength > 5 && this.data.admin == 0){
              wx.showModal({
                title: '提示',
                content: '普通用户最多上传5件物品' 
              })
            }
            else if(this.data.goodname.length > 15 || this.data.goodprice.length > 4){
              wx.showModal({
                title: '提示',
                content: '物品名称过长或售价太高' 
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
})