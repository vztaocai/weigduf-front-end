import {
   Config
} from '../../utils/config.js';
import {Login} from 'login-model.js';
var login = new Login();

Page({

   data: {
      //判断小程序的API，回调，参数，组件等是否在当前版本可用。
      canIUse: wx.canIUse('button.open-type.getUserInfo')
   },

   onLoad: function(options) {
      console.log(options.themeId)
      this.setData({
         from: options.from
      })
      if(options.themeId){
         this.setData({
            themeId: options.themeId
         })
      }

   },


   bindGetUserInfo: function(e) {
      var that = this;
      if (e.detail.userInfo) {
         
         if (wx.getStorageSync('openid') && wx.getStorageSync('token')) {
            wx.showToast({
               title: '正在登陆...',
               icon: 'loading',
               duration: 10000
            })
            wx.request({
               url: Config.restUrl + 'login',
               method: 'POST',
               data: {
                  openid: wx.getStorageSync('openid'),
                  nickName: e.detail.userInfo.nickName,
                  gender: e.detail.userInfo.gender,
                  avatarUrl: e.detail.userInfo.avatarUrl,
                  country: e.detail.userInfo.country,
                  province: e.detail.userInfo.province,
                  city: e.detail.userInfo.city
               },
               header: {
                  'content-type': 'application/json',
                  'token': wx.getStorageSync('token')
               },
               success: function(res) {
                  console.log(res)
                 
                  if (res.statusCode == 201) {
                     //授权成功且数据保存后，跳转进入小程序首页
                     login.getUserInfo((res)=>{
                        wx.setStorageSync('userInfo', res)
                     })
                     if (that.data.from == 'chat' || that.data.from == 'my' || that.data.from == 'home'){
                        wx.switchTab({
                           url: '/pages/' + that.data.from + '/' + that.data.from
                        })
                     }
                     else if(that.data.from == 'themeDetail'){
                        wx.redirectTo({
                           url: '/pages/theme-detail/theme-detail?themeId='+ that.data.themeId
                        })
                     }
                     else{
                        wx.redirectTo({
                           url: '/pages/' + that.data.from + '/' + that.data.from
                        })
                     }  
                  }
               }
            })
         }
      }
   },


   


})