import {
   Config
} from 'config.js';

class Token extends Config {
   constructor() {
      super();
      this.baseRequestUrl = Config.restUrl;
   }

   verify() {
      var token = wx.getStorageSync('token');
      console.log(token)
      if (token) {
         this.verifyLocalToken(token);
      } else {
        
         this.getTokenFromServer();
      }
   }

   verifyLocalToken(token) {
      var url = this.baseRequestUrl + 'token/verify';
      var that = this;

      wx.request({
         url: url,
         data: {
            token: token
         },
         method: 'POST',
         header: {
            'content-type': 'application/x-www-form-urlencoded'
         },
         success: function(res) {
            if (!res.data.isValid) {
               that.getTokenFromServer();
            }
         },
         fail: function(res) {
            console.log(res)
         }
      })
   }

   getTokenFromServer(callBack) {
      var url = this.baseRequestUrl + 'token/user';
      
      wx.login({
         success: function(res) {
            console.log(res.code)
            wx.request({
               url: url,
               data: {
                  code: res.code
               },
               method: 'POST',
               header: {
                  'content-type': 'application/x-www-form-urlencoded'
               },
               success: function (res) {
                  console.log(res)
                  wx.setStorageSync('token', res.data.token);
                  wx.setStorageSync('openid', res.data.openid);
                  wx.setStorageSync('permission', res.data.permission);
                  callBack && callBack(res.data.token);
               },
               fail: function(res) {
                  console.log(res)
               }
            })
         },
         fail: function(res) {
            console.log(res)
         }
      })
   }
}

export {Token};