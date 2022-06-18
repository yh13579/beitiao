const app = getApp();
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
       // empty:'',
        index:0,
        auditdetail:1,
        index_on:true,
        index_au:false,
        index_no:false
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
        wx.setStorageSync('openId', res.result.userInfo.openId)
        let length = this.data.goodsList.length
        wx.cloud.database().collection('goods')
        .where({  
            _openid:res.result.userInfo.openId,  
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
    // if(this.data.goodsList.length == 0){
    //     this.setData({
    //         empty:1
    //     })
    // }
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
              content:'只有上架的物品才能跳转详情页',
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
              auditdetail:1,
           })
        }
        else if(this.data.index == 1 && this.data.auditing.length == 0 && this.data.index_au == false){
            this.setData({
                auditdetail:-1,
                index_au:true
            })
            this.getmylist()
            this.setData({
                goodsList:this.data.auditing
            })
        }
        else if(this.data.index == 2 && this.data.nopassed.length == 0 && this.data.index_no == false){
            this.setData({
                auditdetail:-2,
                index_no:true
            })
            this.getmylist()
            this.setData({
                goodsList:this.data.nopassed
            })
        }
        else if(this.data.index == 1){
            this.setData({
                goodsList:this.data.auditing,
                auditdetail:-1,
            })
        }
        else if(this.data.index == 2){
            this.setData({
                goodsList:this.data.nopassed,
                auditdetail:-2,
            })
        }
    },
    choose(){
       if(this.data.state == 0){
           wx.showActionSheet({
             itemList: ['标记为卖出物品','删除'],
             success:res => {
                 if(res.tapIndex == 0){
                    console.log("点击的是标记为卖出物品")
                 }
                else{
                    console.log("点击的是删除")
                }
             },
             fail:function(){
                console.log("点击了取消")
             }
           })
       }
       else if(this.data.state == 1){
        wx.showActionSheet({
            itemList: ['修改物品信息','删除'],
            success:res => {
                if(res.tapIndex == 0){
                   console.log("点击的是修改物品信息")
                }
               else{
                   console.log("点击的是删除")
               }
            },
            fail:function(){
               console.log("点击了取消")
            }
          })
       }
       else{
        wx.showActionSheet({
            itemList: ['重新编辑物品信息','删除'],
            success:res => {
                if(res.tapIndex == 0){
                   console.log("点击的是重新编辑物品信息")
                }
               else{
                   console.log("点击的是删除")
               }
            },
            fail:function(){
               console.log("点击了取消")
            }
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