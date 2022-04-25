var idx
Page({
    /**
     * 页面的初始数据
     */ 
    data: {
        idx:0,
        goodsList:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getauditlist()
    },
    getauditlist(){
        let length = this.data.goodsList.length
        wx.cloud.database().collection('goods')
        .where({
            audit:-1
        })
        .skip(length)
        .get()
        .then(res => {
            let len = res.data.length
            this.setData({
                goodsList:this.data.goodsList.concat(res.data)
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
    accept(event){             //点击通过
        let id = event.currentTarget.dataset.id
        wx.cloud.database().collection("goods")
        .doc(id)
        .update({
     //1表示上架（审核通过），-1表示审核中，-2表示审核未通过
            data:{
                audit:1
            }
        })
        .then(res => {   //实时更新数组
            let idx = event.currentTarget.dataset.idx
            var goodsList= this.data.goodsList;
            goodsList.splice(idx,1)
            this.setData({
              goodsList: goodsList,
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
    reject(event){             //点击拒绝
        console.log(event)
        let id = event.currentTarget.dataset.id
        wx.cloud.database().collection("goods")
        .doc(id)
        .update({//1表示上架（审核通过），-1表示审核中，-2表示审核未通过
            data:{  
                audit:-2,
                reason:"此物品描述不规范"
            }
        })
        .then(res => {   //实时更新数组
            let idx = event.currentTarget.dataset.idx
            var goodsList= this.data.goodsList;
            goodsList.splice(idx,1)
            this.setData({
              goodsList: goodsList,
            })
        })
        .catch(err => {
            console.log(err)
        })
    },
    gotodetail(event){
        let id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '../detail/detail?id='+id,
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
        this.getauditlist()
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    }
})