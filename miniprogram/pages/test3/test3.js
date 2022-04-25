Page({
    /**
     * 页面的初始数据
     */ 
    data: {
        buttons:['已上架','审核中','未通过'],
        state:'',
        onselveslist:[],
        auditlist:[],
        nopasslist:[],
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
            let length = this.data.onselveslist.length
            wx.cloud.database().collection('goods')
            .where({
                openid:res.result.openid,
                audit:this.data.auditdetail, 
       //（非管理员上传物品数量最大为10，管理员无上限）
            }).orderBy('createTime','desc')
            .skip(length)
            .get() 
            .then(res => {
                if(this.data.index == 0){
                    this.setData({
                        onselveslist:this.data.onselveslist.concat(res.data)
                    })
                    if(this.data.onselveslist.length == 0){
                        this.setData({
                            empty:1
                        })
                    }
                }
                else if(this.data.index == 1){
                    this.setData({
                        auditlist:this.data.auditlist.concat(res.data)
                    })
                    if(this.data.auditlist.length == 0){
                        this.setData({
                            empty:1
                        })
                    }
                }
                else{
                    this.setData({
                        nopasslist:this.data.nopasslist.concat(res.data)
                    })
                    if(this.data.nopasslist.length == 0){
                        this.setData({
                            empty:1
                        })
                    }
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
            this.setData({
                newlist:this.data.goodsList
            })
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