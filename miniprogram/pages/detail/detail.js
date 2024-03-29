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
        detailid:'',
        phone:'',
        gooddetail:'',
        goodname:'',
        goodprice:'',
        nickName:'',
        avatarUrl:'',
        show_shopcard:false,
        shopcard_img:'',
        sk_openid:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.gettest()
        this.data.detailid = options.id
        this.getId(options.id)
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

    shop_card(event){
        let avatar_Url = wx.getStorageSync('avatarUrl')
        if(avatar_Url == 0){
            this.judgment()
            return
        }

        let id  = this.data.detailid
        wx.cloud.database().collection("goods")
        .doc(id)
        .get()
        .then(res => {
            this.setData({
                sk_openid:res.data._openid
            })
            wx.cloud.database().collection("information")
            .where({
                _openid:this.data.sk_openid
            })
            .get()
            .then(res =>{  
               // console.log(res)
                //console.log(res.data[0].shop_card)
                if(res.data[0].shop_card == undefined || res.data[0].shop_card == ""){
                    this.setData({
                        shopcard_img:"cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/haveno2.jpg",
                        show_shopcard:true
                    })
                }
                else{
                    this.setData({
                        shopcard_img:res.data[0].shop_card,
                        show_shopcard:true
                    })
                }
            })
        })
    },
    close_card(){
        this.setData({
            show_shopcard:false
        })
    },
    
    phone(event){
        let avatar_Url = wx.getStorageSync('avatarUrl')
        if(avatar_Url == 0){
            this.judgment()
            return
        }
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone,
      success: function () {        
        console.log("拨打电话成功！")      
      },      
      fail: function (e) {            
        console.log("用户取消")  
      }
    })
  },

  judgment(){
    wx.showModal({
        title: '提示',
        content:'该功能在登录之后开放',
        showCancel:false,
        success:res => {
        getUserProfile().then(res => {
            wx.showToast({
                icon: "true",
                title: "已登录"
              })
        })
      }
    })
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
    getId(id) {   
        wx.cloud.database().collection("goods")
          .doc(id)
          .get()
          .then(res => {  
            this.setData({
              imgUrl: res.data.imgUrl,
              phone:res.data.phone,
              gooddetail:res.data.gooddetail,
              goodprice:res.data.goodprice,
              goodname:res.data.goodname,
              nickName:res.data.userNickName,
              avatarUrl:res.data.userAvatarUrl
            })
          })
          .catch(err => {
            console.log(err)
          })
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
})