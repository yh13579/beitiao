const db = wx.cloud.database();  
Page({
    /**
     * 页面的初始数据
     */
    data: {
        goodsList: [],      //物品列表 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.findgood()

    },
    findgood(){            //读取数据库中的goods
        let length = this.data.goodsList.length
        db.collection('goods').where({
          audit:1
        }).orderBy('createTime','desc')
        .skip(length)
        .get()
        .then(res => {
          this.setData({
            goodsList:this.data.goodsList.concat(res.data)
          })
        })
      },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.setData({
            goodsList:[]
        })
       this.findgood()  
       wx.stopPullDownRefresh()
       console.log("刷新成功")
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        let _ = db.command
      let length = this.data.goodsList.length
      let old_data = this.data.goodsList
      let timestamp = Date.parse(new Date()) / 1000
      db.collection("goods").where(_.or([
        {   //createTime:timestamp,
            audit:1, 
            //物品名称
          goodname: db.RegExp({ //使用正则查询，实现对搜索的模糊查询
            regexp: this.data.value,
            options: 'i', //大小写不区分
          }),
        },
        {  audit:1,   //物品详情
          gooddetail: db.RegExp({
            regexp: this.data.value,
            options: 'i',
          }),
        },
        {   audit:1,  //物品种类
          category: db.RegExp({
            regexp: this.data.value,
            options: 'i',
          }),
        }
      ])).orderBy('createTime','desc').skip(length)  //跳过已读取的数据
      .get()
      .then(res => { 
            this.setData({
              goodsList:old_data.concat(res.data),
            })  
      })
      .catch(err => {
        console.log(err)
      })

    },
    detail(event){         //切换到物品详情页
        let id = event.currentTarget.dataset.id
        console.log(id)
        wx.navigateTo({ 
          url: '../detail/detail?id=' + id,
        })
      },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})