Page({
    /**
     * 页面的初始数据   
     */ 
    data: {
        idx:0,
        goodsList:[],  
        empty:''
    },
    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function (options) {
        this.getmylist()
    },
    getmylist(){
        wx.cloud.callFunction({
            name: 'login',
          })
          .then( res =>{
            let length = this.data.goodsList.length
            wx.cloud.database().collection('goods')
            .where({
                _openid:res.result.userInfo.openId,  
                audit:2   //audit:2表示已卖出  
            })
            .skip(length)
            .get()
            .then(res => {
                this.setData({
                    goodsList:this.data.goodsList.concat(res.data)
                })
                if(this.data.goodsList.length == 0){
                    this.setData({
                        empty:1
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
          })
      
    },
    sold_longpress(event){ 
        let id = event.currentTarget.dataset.id
        let idx = event.currentTarget.dataset.idx
        wx.showActionSheet({
          itemList: ['删除'],
          success:res => {  
              //console.log("点击了删除")
              var goodsList = this.data.goodsList
              goodsList.splice(idx,1)
              this.setData({
                goodsList: goodsList,
              })
              wx.cloud.database().collection("goods")
              .doc(id)
              .remove()
              .then(res => {
                  //console.log("数据库中删除成功",res)
              })
              .catch(res => {
                  //console.log("数据库中删除失败",res)
              })
          },
          fail:function(res){
              //console.log("点击了取消")
          }
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
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getmylist()
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    }
})