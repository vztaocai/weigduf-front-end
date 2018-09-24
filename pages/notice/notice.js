import {
   ThemeModel
} from '../../utils/theme-model.js';
import {
   Login
} from '../login/login-model.js';

var themeModel = new ThemeModel();
var login = new Login();

Page({
   data: {
      currentPage: "notice",
      index: 0,
      nomore: false
   },

   onLoad: function() {
      login.checkAdmin();
      this.setData({
         currentUser: wx.getStorageSync('userInfo')
      })

      themeModel.getAllThemeByType(this.data.index, 'notice', '', (res) => {
         this.setData({
            noticeData: res,
            index: this.data.index + 1
         })
         this.setData({
            nomore: true
         })
      })
   },

   onReachBottom: function (e) {
      var noticeData = this.data.noticeData;
      console.log(noticeData)

      themeModel.getAllThemeByType(this.data.index, 'notice', '', (res) => {

         noticeData = noticeData.concat(res);
         this.setData({
            noticeData: noticeData,
            index: this.data.index + 1
         })
      })
   },

   onPullDownRefresh() {
      wx.showNavigationBarLoading();
      themeModel.getAllThemeByType(0, 'notice', '', (res) => {
         this.setData({
            noticeData: res,
            index: 1
         })
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
   },


   preImage: function(e) {
      var src = e.currentTarget.dataset.src;
      var imgs = e.currentTarget.dataset.imgs;
      var imgUrlArr = [];

      for (var i = 0; i < imgs.length; i++) {
         imgUrlArr.push(imgs[i].url);
      }

      wx.previewImage({
         current: src,
         urls: imgUrlArr
      })
   },

   onShareAppMessage(e) {
      if (e.from == 'button') {
         var content = e.target.dataset.content;
         var themeId = e.target.dataset.themeId;
         var path = '/pages/theme-detail/theme-detail?themeId=' + themeId;

         return {
            title: content,
            path: path,
         }
      } else {
         return {
            title: '教务系统 | 查电费 | 表白墙 | 校内通知 | 失物招领 | 闲置交易 | 图书馆 | 社团组织',
         }
      }
   },

   onClickLike: function(e) {
      var noticeId = e.currentTarget.dataset.id;
      var data = this.data.noticeData;
      var index = this.getIndex(data, noticeId);

      if (data[index].isLike) {
         this.setData({
            ["noticeData[" + index + "].like"]: data[index].like - 1,
            ["noticeData[" + index + "].isLike"]: !data[index].isLike
         })
      } else {
         this.setData({
            ["noticeData[" + index + "].like"]: data[index].like + 1,
            ["noticeData[" + index + "].isLike"]: !data[index].isLike
         })
      }

      themeModel.changeLike(noticeId)
   },

   //跳转到发布页面
   onToPost: function(e) {
      wx.redirectTo({
         url: '/pages/post/post?from=' + this.data.currentPage
      })
   },

   // //点击评论弹出评论框
   // onShowComment: function(e) {
   //    wx.getSetting({
   //       success: function (res) {
   //          if (!res.authSetting['scope.userInfo']) {
   //             wx.redirectTo({
   //                url: '/pages/login/login?from=notice'
   //             })
   //          }
   //       }
   //    })
   //    var noticeId = e.currentTarget.dataset.id;
   //    var data = this.data.noticeData;
   //    var index = this.getIndex(data, noticeId);

   //    this.setData({
   //       replyData: '',
   //       ["noticeData[" + index + "].commenting"]: true
   //    })
   // },

   // closeCommenting: function(e) {
   //    var noticeId = e.currentTarget.dataset.id;
   //    var data = this.data.noticeData;
   //    var index = this.getIndex(data, noticeId);

   //    this.setData({
   //       ["noticeData[" + index + "].commenting"]: false,

   //    })
   // },

   // //点击发布评论按钮
   // formSubmit: function(e) {
   //    var comment = e.detail.value.comment;
   //    var noticeId = e.currentTarget.dataset.id;
   //    var data = this.data.noticeData;
   //    var index = this.getIndex(data, noticeId);
   //    if (comment.length < 1) {
   //       wx.showToast({
   //          title: '内容不能为空',
   //          icon: 'none'
   //       })
   //       return;
   //    }
   //    themeModel.postComment(noticeId, comment, this.data.replyData, (res) => {
   //       if (res) {
   //          //更新评论
   //          this.setData({
   //             ["noticeData[" + index + "].comments"]: res,
   //             ["noticeData[" + index + "].commenting"]: false
   //          })
   //          wx.showToast({
   //             title: '评论成功',
   //             icon: 'success'
   //          })
   //       }
   //    })
   // },

   // onReply: function(e) {
   //    wx.getSetting({
   //       success: function (res) {
   //          if (!res.authSetting['scope.userInfo']) {
   //             wx.redirectTo({
   //                url: '/pages/login/login?from=notice'
   //             })
   //          }
   //       }
   //    })
   //    var noticeId = e.currentTarget.dataset.id;
   //    var toUserId = e.currentTarget.dataset.toUserId;
   //    var toNickname = e.currentTarget.dataset.toNickname;
   //    var data = this.data.noticeData;
   //    var index = this.getIndex(data, noticeId);
   //    if (toUserId == wx.getStorageSync('userInfo').id) {
   //       return;
   //    }
   //    this.setData({
   //       ["noticeData[" + index + "].commenting"]: true,
   //       replyData: {
   //          toNickname: toNickname,
   //          toUserId: toUserId
   //       }
   //    })
   // },

   getIndex: function(data, noticeId) {
      for (var i = 0; i < data.length; i++) {
         if (data[i].id == noticeId) {
            return i;
         }
      }
   },

   toDetail(e) {
      var themeId = e.currentTarget.dataset.themeId;
      wx.navigateTo({
         url: '/pages/theme-detail/theme-detail?themeId=' + themeId
      })
   }


});