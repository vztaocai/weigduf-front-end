import {
   Token
} from 'utils/token.js';
import {
   Login
} from '/pages/login/login-model.js';

var login = new Login();
var token = new Token();

App({
   onLaunch: function() {

      token.verify();

      var that = this;
      // 查看是否授权
      // wx.getSetting({
      //    success: function(res) {
      //       if (!res.authSetting['scope.userInfo']) {
      //          wx.redirectTo({
      //             url: '/pages/login/login'
      //          })
      //       } else {
      //          login.getUserInfo((res) => {
      //             wx.setStorageSync('userInfo', res);
      //          })
      //       }
      //    }
      // })
   }
})