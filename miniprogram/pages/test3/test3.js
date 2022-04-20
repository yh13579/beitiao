Page({
    data: { 
      columns: [{
          "columns_detail": "生活用品"
        },
        {
            "columns_detail": "学习用品"
          },
          {
            "columns_detail": "休闲用品"
          },
          {
            "columns_detail": "休闲玩物"
          },
          {
            "columns_detail": "美妆护肤"
          },
          {
            "columns_detail": "电子设备"
          },
          {
            "columns_detail": "药物"
          },
          {
            "columns_detail": "其他"
          },
      ],
      state: '',
    },
    //选择用途后加样式
    select_use: function(e) {
      this.setData({
        state: e.currentTarget.dataset.key,
      });
    },
    onReady: function() {},
  })