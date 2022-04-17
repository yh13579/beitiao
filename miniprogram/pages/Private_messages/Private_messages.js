Page({
  /**
   * 页面的初始数据
   */
  data: {
    customernickname:'',        //顾客微信名称
    customeravatar:'',          //顾客微信头像
    shopkeeper_nickname:'',     //传递值，商家的昵称
    shopkeeper_nickname:'',
    shopkeeper_avatarUrl:'',
    shopkeeper_goodname:'',
    shopkeeper_goodprice:'',
    shopkeeper_gooddetail:'',
    currentid:'',
    //此处的chatlists必然需要在数据库进行查找
    
    invalue:''     //输入框内容
  },
  sendMsg:function(event){      //在这里准备先判断用户授权
    if(this.data.invalue == 0){
        console.log("没有输入内容")
        wx.showModal({
          title: '提示',
          content:'输入框不能为空'        
        })
        return
    }
    let obj = {
      customernickname:this.data.customernickname,
      customeravatar:this.data.customeravatar,
      content:this.data.invalue
    };
    let arr = this.data.chatlists;
    arr.push(obj)
    this.setData({
      chatlists:arr,
      invalue:''
    })
    if(this.data.chatlists.length == 4){
        wx.cloud.database().collection("message")
        .add({
          data:{
            chatlists:this.data.chatlists,
            current:1
          }
        })
        this.getcurrentid()
    }
    else if(this.data.chatlists.length > 4 ){
        wx.cloud.database().collection("message")
        .doc(this.data.currentid)
        .update({
            data:{
                chatlists:this.data.chatlists
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
  },
  getcurrentid(){
    wx.cloud.callFunction({
        name: 'login',
      })
      .then(res => {
        wx.cloud.database().collection("message")
        .where({
            openid:res.result.openid,
            current:1
        }).get()
        .then(res => {
            this.setData({
            currentid:res.data[0]._id,
            })
          })
      })
  },

  getInput:function(e){
    this.setData({invalue:e.detail.value});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let avatarUrl = wx.getStorageSync("avatarUrl")
    let nickName = wx.getStorageSync("nickName")
    let shopkeeper_nickname = options.shopkeeper_nickname
    let shopkeeper_avatarUrl = options.shopkeeper_avatarUrl
    let shopkeeper_goodname = options.shopkeeper_goodname
    let shopkeeper_goodprice = options.shopkeeper_goodprice
    let shopkeeper_gooddetail = options.shopkeeper_gooddetail
    this.setData({    
      customernickname:nickName,
      customeravatar:avatarUrl,
      shopkeeper_nickname:shopkeeper_nickname,
      shopkeeper_avatarUrl:shopkeeper_avatarUrl,
      shopkeeper_goodname:shopkeeper_goodname,
      shopkeeper_goodprice:shopkeeper_goodprice,
      shopkeeper_gooddetail:shopkeeper_gooddetail
    })
    wx.setNavigationBarTitle({
      title: this.data.shopkeeper_nickname,
    })
    this.setData({
        chatlists:[    
            {
              nickname:this.data.shopkeeper_nickname,
              avatar:this.data.shopkeeper_avatarUrl,
              content:this.data.shopkeeper_goodname
            },
            {
                nickname:this.data.shopkeeper_nickname,
                avatar:this.data.shopkeeper_avatarUrl,
                content:this.data.shopkeeper_goodprice
              },
            {
                nickname:this.data.shopkeeper_nickname,
                avatar:this.data.shopkeeper_avatarUrl,
                content:this.data.shopkeeper_gooddetail
            }
          ],
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
    if(this.data.currentid.length == 0){
        console.log("用户没有评论")
      }
      else{
        console.log("用户写了评论")
        wx.cloud.database().collection("message")
        .doc(this.data.currentid)
        .update({
            data:{
                current:0 
            }
        })
        .catch(err => {
            console.log(err)
        })
      }
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

  }
})
