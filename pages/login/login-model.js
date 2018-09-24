import {
   Base
} from '../../utils/base.js';
import {
   Config
} from '../../utils/config.js';
class Login extends Base {

   getUserInfo(callBack) {
      var params = {
         url: 'userInfo/' + wx.getStorageSync('openid'),
         sCallBack: function(res) {
            callBack(res)
         },
         eCallBack: function(res) {
            callBack(res.data)
         }
      }

      this.request(params);
   }

   checkAdmin() {
      var user = wx.getStorageSync('userInfo');
      if (user['permission'] > 16) {
         this.getUserInfo((res) => {
            wx.setStorageSync('userInfo', res)
         });
      }
   }

   repeatLogin() {
      var that = this;
      wx.getUserInfo({
         success: function(res) {
            // wx.setStorageSync('userInfo', res.userInfo);
            
            if (wx.getStorageSync('openid') && wx.getStorageSync('token')) {
               console.log(res.userInfo);
               wx.request({
                  url: Config.restUrl + 'login',
                  method: 'POST',
                  data: {
                     openid: wx.getStorageSync('openid'),
                     nickName: res.userInfo.nickName,
                     gender: res.userInfo.gender,
                     avatarUrl: res.userInfo.avatarUrl,
                     country: res.userInfo.country,
                     province: res.userInfo.province,
                     city: res.userInfo.city
                  },
                  header: {
                     'content-type': 'application/json',
                     'token': wx.getStorageSync('token')
                  },
                  success: function(res) {
                     if (res.statusCode == 201) {
                        that.getUserInfo((res) => {
                           wx.setStorageSync('userInfo', res)
                        })
                     }
                  }
               })
            }
         }
      })


   }
}

export {
   Login
}