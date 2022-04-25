Page({
    /**
     * 页面的初始数据
     */ 
    data: {
        buttons:['已上架','审核中','未通过'],
        state:'',
        goodsList:[],
        onselvelist:[],
        auditing:[],
        nopassed:[],
        empty:'',
        index:0,
        auditdetail:1
    },
    /**
     * 生命周期函数--监听页面加载 
     */
    onLoad: function (options) {
        this.getmylist()
    },  
    getmylist(){   
//audit:1表示已上架，audit:-1表示审核中,audit：-2表示未通过
    wx.cloud.callFunction({
        name: 'login',
    })
    .then( res =>{ 
        let length = this.data.goodsList.length
        wx.cloud.database().collection('goods')
        .where({
            openid:res.result.openid,
            audit:this.data.auditdetail, 
       //（非管理员上传物品数量最大为10，管理员无上限）
        })
    .orderBy('createTime','desc')
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
    if(this.data.index == 0){
        console.log("获取已上架物品列表")
        this.setData({
          onselvelist:this.data.goodsList
        })
        }
    else if(this.data.index == 1){
        console.log("获取审核中物品列表")
        this.setData({
            auditing:this.data.goodsList
        })
        }
    else if(this.data.index == 2){
        console.log("获取未通过物品列表")
        this.setData({
            nopassed:this.data.goodsList
        })
      }
    })
        .catch(err => {
                console.log(err)
            })
          })
    },
    detail(event){         //切换到物品详情页
        let id = event.currentTarget.dataset.id
        if(this.data.auditdetail == 1){
            wx.navigateTo({ 
                url: '../detail/detail?id=' + id,
              })
        }
        else{
            wx.showModal({
              title: '提示',
              content:'只有上架的物品才能看到详情页',
              showCancel:false
            })
        }
      },
    buttonsdetail(event){
        this.setData({
            state:event.currentTarget.dataset.index,
            index:event.currentTarget.dataset.index,
        })
        if(this.data.index == 0 ){
           this.setData({
              goodsList:this.data.onselvelist,
              auditdetail:1
           })
        }
        else if(this.data.index == 1 && this.data.auditing.length == 0){
            this.setData({
                auditdetail:-1,
                goodsList:[]
            })
            this.getmylist()
            this.setData({
                goodsList:this.data.auditing
            })
        }
        else if(this.data.index == 2 && this.data.nopassed.length == 0){
            this.setData({
                auditdetail:-2,
                goodsList:[]
            })
            this.getmylist()
            this.setData({
                goodsList:this.data.nopassed
            })
        }
        else if(this.data.index == 1){
            this.setData({
                goodsList:this.data.auditing,
                auditdetail:-1
            })
        }
        else if(this.data.index == 2){
            this.setData({
                goodsList:this.data.nopassed,
                auditdetail:-2
            })
        }
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