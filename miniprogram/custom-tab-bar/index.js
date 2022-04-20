// custom-tab-bar/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
  
	},
  
	/**
	 * 组件的初始数据
	 */
	data: {
	  active: null,
	  "list": [
		{
		  "pagePath": "/pages/index/index"
		},
		{
          "pagePath": "/pages/upload/upload"
        },
		{
		  "pagePath": "/pages/mine/mine"
		}
	  ]
	},
  
	/**
	 * 组件的方法列表
	 */
	methods: {
	  onChange:function(event){
		// console.log(event.detail);
		const index = event.detail;
  
		// 在这里设置active会造成闪烁
		// this.setData({
		//   active: event.detail
		// });
		wx.switchTab({
		  url: this.data.list[index].pagePath
		})
	  }
	}
  })
  
  