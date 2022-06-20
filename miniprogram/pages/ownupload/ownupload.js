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
        index_no:false,
        idx:0,
        goodname:'',
        gooddetail:'',
        phone:'',
        imgUrl:'',
        goodprice:''
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
           if(this.data.onselvelist.length <1){
            this.show_none()
          }
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
            if(this.data.auditing.length <1){
              this.show_none()
            }
        }
        else if(this.data.index == 2){
            this.setData({
                goodsList:this.data.nopassed,
                auditdetail:-2,
            })
            if(this.data.nopassed.length <1){
                this.show_none()
            }
        }
    },



    choose(event){ 
       let id = event.currentTarget.dataset.id
       let idx = event.currentTarget.dataset.idx 

       if(this.data.state == 0){    //已上架
           wx.showActionSheet({
             itemList: ['标记为卖出物品','删除'],
             success:res => {
                 if(res.tapIndex == 0){
                    console.log("点击的是标记为卖出物品")
                    var onselvelist = this.data.onselvelist
                    onselvelist.splice(idx,1)
                    this.setData({
                        goodsList:onselvelist,
                    })
                    wx.cloud.database().collection("goods")
                    .doc(id)
                    .update({
                        data:{ 
                            audit:2
                        }
                    })
                    .then(res => {
                        console.log("successed,good sold")
                        wx.showModal({
                            title: '操作成功',
                            content: '该物品标记为已卖出' ,
                            showCancel:false
                          })
                    })
                 }
                else{
                    console.log("点击的是删除")
                    console.log(id)
                    console.log("物品",idx)
                    var onselvelist = this.data.onselvelist
                    onselvelist.splice(idx,1)
                    this.setData({
                        goodsList:onselvelist,
                    })
                    wx.cloud.database().collection("goods")
                    .doc(id)
                    .remove()
                    .then(res => {
                        console.log("数据库中删除成功",res)
                    })
                    .catch(res => {
                        console.log("数据库中删除失败",res)
                    })
                }
             },
             fail:function(){
                console.log("点击了取消")
             }
           })
       }


       else if(this.data.state == 1){    //审核中
        wx.showActionSheet({
            itemList: ['修改物品信息','删除'],
            success:res => {
                if(res.tapIndex == 0){
                   console.log("点击的是修改物品信息")
                   console.log(event)
                   wx.cloud.database().collection("goods")
                   .doc(id)
                   .get()
                   .then(res => {
                       let id_audit = event.currentTarget.dataset.id
                       wx.navigateTo({  
                        url: '../test/test?id_audit=' + id_audit   
                      })
                   })
                }
               else{
                   console.log("点击的是删除")
                   console.log(id)
                   var auditing = this.data.auditing
                    auditing.splice(idx,1)
                    this.setData({
                        goodsList:auditing,
                    })
                    wx.cloud.database().collection("goods")
                    .doc(id)
                    .remove()
                    .then(res => {
                        console.log("数据库中删除成功",res)
                    })
                    .catch(res => {
                        console.log("数据库中删除失败",res)
                    })
               }
            },
            fail:function(){
               console.log("点击了取消")
            }
          })
       }


       else{              //未通过
        wx.showActionSheet({
            itemList: ['重新编辑物品信息','删除'],
            success:res => {
                if(res.tapIndex == 0){
                   console.log("点击的是重新编辑物品信息")
                   wx.cloud.database().collection("goods")
                   .doc(id)
                   .get()
                   .then(res => {
                       let id_audit = event.currentTarget.dataset.id
                       wx.navigateTo({  
                        url: '../test/test?id_audit=' + id_audit   
                      })
                   })
                }
               else{
                   console.log("点击的是删除")
                   console.log(id)
                   console.log("物品",idx)
                   var nopassed = this.data.nopassed
                   nopassed.splice(idx,1)
                   this.setData({
                    goodsList:nopassed,
                   })
                   wx.cloud.database().collection("goods")
                   .doc(id)
                   .remove()
                   .then(res => {
                       console.log("数据库中删除成功",res)
                   })
                   .catch(res => {
                       console.log("数据库中删除失败",res)
                   })
               }
            },
            fail:function(){
               console.log("点击了取消")
            }
          })
       }
    },


    show_none(){
        wx.showToast({
            icon: "none",
            title: "没有更多了.."
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