// app.js
App({
  globalData: {
    statusBarHeight: 44,
    navBarHeight: 44,
    menuButtonBounding: null
  },

  onLaunch() {
    // 获取微信小程序胶囊和状态栏高度，确保自定义导航栏完美对齐
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 44;
      let navBarHeight = 44;

      if (wx.getMenuButtonBoundingClientRect) {
        const menuButton = wx.getMenuButtonBoundingClientRect();
        if (menuButton && menuButton.top && menuButton.height) {
          const calculatedNav = (menuButton.top - statusBarHeight) * 2 + menuButton.height;
          if (calculatedNav > 0) {
            navBarHeight = calculatedNav;
          }
          this.globalData.menuButtonBounding = menuButton;
        }
      }

      this.globalData.statusBarHeight = statusBarHeight;
      this.globalData.navBarHeight = navBarHeight;
    } catch (e) {
      console.warn('Get system info failed:', e);
      this.globalData.statusBarHeight = 44;
      this.globalData.navBarHeight = 44;
    }
  }
});
