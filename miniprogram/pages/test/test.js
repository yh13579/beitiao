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
          test:'',
          columns: ['生活用品','学习用品','休闲食品','休闲玩物','美妆护肤','电子设备','药物','其他'],   
          state: -1,
          tempFilePaths: "",    //要上传的文件的小程序临时文件路径
          imgUrl:'',
          goodname:'',
          phone:'',
          gooddetail:'',
          goodprice:'',
          category:'',
          ownlistlength:'',
          id_audit:''
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
      haha(){
        wx.showModal({
            title: '提示',
            content:'然后就没有然后了~',
            showCancel:false
          })
      },
      getPhoto() { 
          wx.showModal({
            title: '提示',
            content:'在本页面进行修改和重新上传时，图片不能更换',
            showCancel:false
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
        this.gettest()
        this.getgood_detail(options.id_audit)
        let admin = wx.getStorageSync('admin')
        this.setData({
            admin:admin,
            id_audit:options.id_audit
        })
      },
      getgood_detail(id){
          wx.cloud.database().collection("goods")
          .doc(id)
          .get()
          .then(res => {
              this.setData({  
                  imgUrl:res.data.imgUrl,
                  goodname:res.data.goodname,
                  gooddetail:res.data.gooddetail,
                  phone:res.data.phone,
                  goodprice:res.data.goodprice.slice(1),
                  tempFilePaths:res.data.imgUrl,
                  state:res.data.state,
                  category:res.data.category
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
      onShow: function (options) {
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
        wx.showModal({
            title: '提示',
            content:'本页面图片不能长按删除',
            showCancel:false
          })
       },

      uploadImg(temFile) {
        let timestamp = Date.parse(new Date()) / 1000
        let date = demo.formatTime(new Date(),"Y-M-D")
        getUserProfile().then(res =>{ 
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          .then(res => {
            wx.cloud.database().collection('goods')
            .doc(this.data.id_audit)
                .update({
                  data: { 
                    imgUrl: res.fileID,  
                    createTime: timestamp, 
                    goodname:this.data.goodname,
                    gooddetail:this.data.gooddetail,
                    goodprice:"¥"+this.data.goodprice,
                    category:this.data.category,
                    phone:this.data.phone,
                    date:date,
                    audit:-1,
                    state:this.data.state
                  }
                })
                .then(res => {
                  wx.hideLoading() 
                  wx.showModal({
                    title: '提示',
                    content: '修改成功,等待管理员审核..',
                    showCancel:false,
                    success(res){
                        wx.navigateBack({
                            delta:2
                        })
                    }
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
          if(this.data.phone.length != 11 || this.data.phone[0] != 1){
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
              else if(this.data.ownlistlength > 10 && this.data.admin == 0){
                wx.showModal({
                  title: '提示',
                  content: '普通用户最多上传10件物品("已上架","审核中","未通过","已卖出"物品的总和)' 
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