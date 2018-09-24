import {
   My
} from 'my-model.js';

import {
   Login
} from '../login/login-model.js';
var my = new My();
var login = new Login();
Page({

   data: {

   },

   onLoad: function(options) {
      wx.getSetting({
         success: function(res) {
            if (!res.authSetting['scope.userInfo']) {
               wx.redirectTo({
                  url: '/pages/login/login?from=my'
               })
            }
         }
      })

      wx.showShareMenu({
         withShareTicket: true
      })
   },
   
   onShow: function() {
      login.getUserInfo((res) => {
         wx.setStorageSync('userInfo', res);
      })

      my.getMyData((res) => {
         this.setData({
            myData: res,
            userInfo: wx.getStorageSync('userInfo')
         })
      })
   },

   onPullDownRefresh() {
      wx.showNavigationBarLoading();
      my.getMyData((res) => {

         this.setData({
            myData: res,
            userInfo: wx.getStorageSync('userInfo')
         })
      })

      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
   },

   toMyPost(e) {
      wx.navigateTo({
         url: '/pages/my/mypost/mypost'
      })
   },

   changeUserInfo: function(e) {
      wx.navigateTo({
         url: '/pages/my/change/change?nickname=' + this.data.userInfo.nickname,
      })
   }
})