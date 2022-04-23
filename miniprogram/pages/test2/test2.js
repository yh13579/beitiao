let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: { 
    nickname:'',        //微信名称
    avatar:'',          //微信头像
    chatlists:[           //此处的chatlists必然需要在数据库进行查找
      {
        nickname:'郭超凡',
        avatar:'https://thirdwx.qlogo.cn/mmopen/vi_32/U6Ed5tspOZTfDOibIPoZyOiceQZLKRa9glF0fuBCFXQPiabECKUibDySyCryOp1ib7Mb9l2Wuylvj1NsxiaibpJFibNxrA/132',
        content:'测试聊天记录1'
      },
      {
        nickname:'郭超凡',
        avatar:'https://thirdwx.qlogo.cn/mmopen/vi_32/U6Ed5tspOZTfDOibIPoZyOiceQZLKRa9glF0fuBCFXQPiabECKUibDySyCryOp1ib7Mb9l2Wuylvj1NsxiaibpJFibNxrA/132',
        content:'测试聊天记录'
      }
    ],
    invalue:''     //输入框内容
  },
  sendMsg:function(event){     //在这里准备先判断用户授权
    console.log(this.data.chatlists.length)
    if(this.data.invalue.length == 0){
        console.log("没有输入内容")
        wx.showModal({
          title: '提示',
          content:'输入框不能为空'        
        })
        return
    }
    let _this = this;
    let obj = {
      nickname:_this.data.nickname,
      avatar:_this.data.avatar,
      content:_this.data.invalue
    };
    let arr = _this.data.chatlists;
    arr.push(obj)
    _this.setData({
      chatlists:arr,
      invalue:''
    });

    // 把聊天内容发送到服务器，处理完成后返回，再把返回的数据放到chatlist里面

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
    this.setData({   
      nickname:nickName,
      avatar:avatarUrl
    }); 
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

  }
})
