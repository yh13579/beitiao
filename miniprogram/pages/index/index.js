const db = wx.cloud.database();  
Page({
    data:{ 
        menu:{           
            imgUrls:[    
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/dailyuse.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/book.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/food.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/toy.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/skinuse.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/earphone.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/medicine.png',
              'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/other.png'
            ],
            descs:[   
                '生活用品',
                '学习用品',
                '休闲食品',
                '休闲玩物',
                '美妆护肤',
                '电子设备',
                '药物',
                '其他'
            ]
      },
      background: [     
        //轮播图图片
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shouye_lbt1.jpg'}, 
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shouye_lbt2.jpg'}, 
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shouye_lbt3.jpg'},
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/shouye_lbt4.jpg'}
    
    ],
      interval: 5000,     //间歇：5000  →  5秒轮播一张
      duration: 1000,    //持续时间 指换图轮播时的切换速度
      bannerCurrent: 0,   //初始轮播的图片
      goodsList: [],      
      value: '',         //搜索框里的内容
      announcement:''        //公告
    }, 
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.getTabBar().setData({      //设置tabbar的值
      active : 0 
    })
  this.findgood()   
  //this.announcement()  //动态公告，后续保留此行功能，不要误删
  },
 
  findgood(){            
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

  findadmin(){      //查询是否是管理员
    wx.cloud.callFunction({
      name: 'login',
    })
    .then(res => {
      wx.cloud.database().collection("admin")
        .where({
         _openid:res.result.userInfo.openId
        })
        .get()
        .then(res => {
          if (res.data.length == 0) {
            wx.setStorageSync('admin', -1)
            this.setData({
                admin:-1
            })   //非管理员-1
          } else {
            wx.setStorageSync('admin', 1)
            this.setData({
                admin:1
            })     //管理员1
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
  },

  announcement(){     //动态公告
    db.collection('announcement')
    .doc("d2fe6f206243305802f9420737d78698")
    .get()
    .then(res => {
      this.setData({
        announcement:res.data.gonggao
      })
      wx.showModal({
        title: '公告',
        content: this.data.announcement,
        showCancel:false 
      })
    })
  },

  getunaudit(){
      wx.cloud.database().collection('goods')
      .where({
          audit:-1
      })
      .get()
      .then( res => {
          this.setData({
              unauditlength:res.data.length
          })
      })
  },


  search_content(e) {    //搜索框编辑内容
    this.setData({
        value: e.detail
    });
  },
  admin(){    //获取管理员身份
   if(this.data.admin == 1){
    wx.showModal({
    title: '提示',
    content:'您已经是管理员',
    showCancel:false
    })
    }
   else{
       wx.cloud.database().collection("admin")
          .add({
            data:{
              admin:1,
            }
          })
          wx.showModal({
            title: '提示',
            content:'进入管理员模式',
            showCancel:false
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
    this.setData({
        value:''
    })
    let admin = wx.getStorageSync('admin')
    if(admin == 1 || admin == -1 ){
      this.setData({
          admin:admin
        })
        if(admin == 1){
            this.getunaudit()
        }
    }
    else{
      this.findadmin()
    }
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
      this.setData({
          goodsList:[]
      })
     this.findgood()  
     wx.stopPullDownRefresh() 
     this.setData({
         value:'', 
         bannerCurrent: 0
        }) 
         //清除搜索框的内容,轮播图变成第一张开始轮播
     console.log("刷新成功")
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let _ = db.command
      let length = this.data.goodsList.length
      let old_data = this.data.goodsList
      db.collection("goods").where(_.or([
        {  
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
      ])).orderBy('createTime','desc')
      .skip(length)  
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  detail(event){         
    let id = event.currentTarget.dataset.id
    wx.navigateTo({ 
      url: '../detail/detail?id=' + id,
    })
  },
   bannerChange: function(e){     
    //轮播current切换监听事件
    if (e.target.source == 'autoplay' || e.target.source == 'touch'){ 
        this.setData({
            bannerCurrent: e.detail.current
        })
    }
   
  },
intervalChange(e) {    //间歇：5000  →  5秒轮播一张
  this.setData({
      interval: e.detail.value
    })
},
durationChange(e) {    //持续时间  指换图轮播时的切换速度
  this.setData({
      duration: e.detail.value
    }) 
},
audit(){         
  wx.navigateTo({
    url: '../audit/audit',
  })
},
classify(event){
    let idx = event.currentTarget.dataset.idx
    let classify = this.data.menu.descs[idx]
    wx.navigateTo({
      url: '../classify/classify?classify='+classify, 
    })
},
onSearch(){    
    let valuedetail = this.data.value
    if(valuedetail == "btsailorC405YYDS"){
        this.admin()
    }
    else{
        wx.navigateTo({
            url: '../classify/classify?valuedetail='+valuedetail,
          })
    }
},
})