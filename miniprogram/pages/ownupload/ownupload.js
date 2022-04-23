Page({
    /**
     * 页面的初始数据
     */ 
    data: {
        buttons:['已上架','审核中','未通过'],
        state:'',
        goodsList:[],
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
    getmylist(){   //audit:1表示已上架，audit:-1表示审核中,audit：-2表示未通过
        wx.cloud.callFunction({
            name: 'login',
          })
          .then( res =>{
            let length = this.data.goodsList.length
            wx.cloud.database().collection('goods')
            .where({
                openid:res.result.openid,
                audit:this.data.auditdetail, 
            //（非管理员最大为5，管理员无上限）
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
    buttonsdetail(event){
        let index = event.currentTarget.dataset.index
        this.setData({
            state:event.currentTarget.dataset.index,
            index:event.currentTarget.dataset.index,
        })
        if(this.data.index == 1 ){
           this.setData({
               auditdetail:-1,
               goodsList:[]
           })
           this.getmylist()
        }
        else if(this.data.index == 2){
            this.setData({
                auditdetail:-2,
                goodsList:[]
            })
            this.getmylist()
        }
        else{
            this.setData({
                auditdetail:1,
                goodsList:[]
            })
            this.getmylist()
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