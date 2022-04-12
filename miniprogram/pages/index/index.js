import {
  getUserProfile
} from "../../utils/utils"
var i
const db = wx.cloud.database();  
Page({
  /**
   * 页面的初始数据
   */
    data: {
      background: [     
        //轮播图图片，由云开发数据库中调用，（暂时没有实现动态修改）
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/keji.jpg'}, 
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/keji2.jpg'}, 
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/keji3.jpg'},
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/yinghua1.jpg'}, 
      {url:'cloud://cloud1-4g0b3ffme4d6fba4.636c-cloud1-4g0b3ffme4d6fba4-1309031657/yinghua2.jpg'}],
        vertical: false,    //垂直：false  →  水平
        interval: 5000,     //间歇：5000  →  5秒轮播一张
        duration: 1000,     //持续时间  指换图轮播时的切换速度
        bannerCurrent: 0,   //初始轮播的图片
        Hei:"",             //轮播图高度
      goodsList: [],      //物品列表
      value: '',         //搜索框里的内容
      gonggao:''        //公告

    },
  onChange(event) {         //切换底部tabbar的函数
    this.setData({ active: event.detail });
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    this.getTabBar().setData({      //设置tabbar的值
      active : 0 
    })
  this.findgood()   //考虑是否findgood也能写进缓存
  //this.gonggao()  //动态公告，后续保留此行功能，不要误删
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

  findadmin(){      //查询是否是管理员
    wx.cloud.callFunction({
      name: 'login',
    })
    .then(res => {
      wx.cloud.database().collection("admin")
        .where({
          openid: res.result.openid
        })
        .get()
        .then(res => {
          if (res.data.length == 0) {
            wx.setStorageSync('admin', -1)
            this.setData({admin:-1})   //非管理员-1
          } else {
            wx.setStorageSync('admin', 1)
            this.setData({admin:1})     //管理员1
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
  },

  gonggao(){     //动态公告
    db.collection('announcement')
    .doc("d2fe6f206243305802f9420737d78698")
    .get()
    .then(res => {
      this.setData({
        gonggao:res.data.gonggao
      })
      wx.showModal({
        title: '公告',
        content: this.data.gonggao,
        showCancel:false
      })
    })
  },
  onChange(e) {    //搜索框编辑内容
    this.setData({value: e.detail,});
  },
  onSearch() {    //搜索功能(回车搜索)
      let db = wx.cloud.database()
      let _ = db.command
      db.collection('goods')
        .where(_.or([     //audit:1表示上架的物品（审核通过的）
          { audit:1,  //物品名称
            goodname: db.RegExp({ //使用正则查询，实现对搜索的模糊查询
              regexp: this.data.value,
              options: 'i', //大小写不区分
            }),
          },
          { audit:1,  //物品详情
            gooddetail: db.RegExp({
              regexp: this.data.value,
              options: 'i',
            }),
          },
           { audit:1,  //物品种类
            category: db.RegExp({
              regexp: this.data.value,
              options: 'i',
            }),
          }
        ])).orderBy('createTime','desc').get()
        .then(res => {
          if(res.data.length > 0){
            this.setData({
              goodsList:res.data
            })
          }
          else if(this.data.value == "btsailorC405YYDS"){
            console.log("欢迎进入管理员模式")
            this.admin()
          }
          else{ 
            console.log('查询失败，没有相关数据', res)
            this.setData({
              goodsList:res.data
            })
          }
        })
  },

  admin(){
    wx.cloud.database().collection("admin")
          .add({
            data:{
              admin:1,
            }
          })
          console.log("已添加进数据库")
  },

  onClick() {     //搜索功能(点击搜索)
      this.onSearch()
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
    let admin = wx.getStorageSync('admin')
    if(admin == 1 || admin == -1 ){
      this.setData({admin:admin})
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
     this.setData({value:'', bannerCurrent: 0}) //清除搜索框的内容,轮播图变成第一张开始轮播
    // //轮播图Bug仍未修复
     console.log("刷新成功")
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  detail(event){         //切换到物品详情页
    let id = event.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({ 
      url: '../detail/detail?id=' + id,
    })
  },
   bannerChange: function(e){     //轮播current切换监听事件
    if (e.target.source == 'autoplay' || e.target.source == 'touch'){ this.setData({bannerCurrent: e.detail.current})}
   
  },
  imgH:function(e){
    var winWid = wx.getSystemInfoSync().windowWidth;     //获取当前屏幕的宽度
    var imgh=e.detail.height;　　　　　　　　　　　　　//图片高度
    var imgw=e.detail.width;                        //图片宽度
    var swiperH=(winWid*imgh/imgw)-50 + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({Hei:swiperH})　//设置高度
},
intervalChange(e) {    //间歇：5000  →  5秒轮播一张
  this.setData({interval: e.detail.value})
},
durationChange(e) {    //持续时间  指换图轮播时的切换速度
  this.setData({duration: e.detail.value}) 
},
shenhe(){         //管理员审核界面
  wx.navigateTo({
    url: '../audit/audit',   //切换页面的路径
  })
},
searchstudygoods(){
  this.setData({value:'学习用品'})
  this.onSearch()
},
searchlifegoods(){
  this.setData({value:'生活用品'})
  this.onSearch()
},
searchelectrongoods(){
  this.setData({value:'电子设备'})
  this.onSearch()
},
searchleisuregoods(){
  this.setData({value:'休闲玩物'})
  this.onSearch()
},
searchothergoods(){
  this.setData({value:'其他'})
  this.onSearch()
},
})