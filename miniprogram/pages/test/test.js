Page({

    /**
     * 页面的初始数据 
     */
    data: {
        style:0,
        score:'black',
        columns: ['生活用品','学习用品','休闲食品','休闲玩物','美妆护肤','电子设备','药物','其他'],  
        sty:0,
        score:'#fff5df'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
  
    },
    score:function(e){
        let that = this;
        that.setData({
            sty:1,
            score:'rgba(252,178,22,0.3)'
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
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    },
    columndetail(event){ 
        let index = event.currentTarget.dataset.index
        let column = this.data.columns[index]
        console.log(column)
        this.setData({
            index:event.currentTarget.dataset['index'],
            style:1,
            score: 'pink'
        })
      }
  })