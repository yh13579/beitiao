// 获取用户信息
function getUserProfile() {
  return new Promise((resolve, reject) => {
    let avatarUrl = wx.getStorageSync("avatarUrl")
    let nickName = wx.getStorageSync("nickName")
    if (avatarUrl && nickName) {
      resolve(
        {
          avatarUrl: avatarUrl,
          nickName: nickName
        }
      )
      
    } else {
      wx.getUserProfile({
        desc: "使用需获取相应权限",
        success: r => {
          wx.setStorageSync('avatarUrl', r.userInfo.avatarUrl)
          wx.setStorageSync('nickName', r.userInfo.nickName)
          resolve(
            {
              avatarUrl: r.userInfo.avatarUrl,
              nickName: r.userInfo.nickName
            }
          )
        },
        fail: e => {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '请允许小程序获得相应权限',
            showCancel: false
          })
        }
      })
    }
  })
};
export {
  getUserProfile
}