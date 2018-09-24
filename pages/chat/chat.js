import {
   ThemeModel
} from '../../utils/theme-model.js';
var themeModel = new ThemeModel();

Page({
   data: {
      currentPage: "chat",
      index: 0,
      nomore: false,
      isUpper: false
   },

   onLoad: function() {

      this.setData({
         currentUser: wx.getStorageSync('userInfo'),
         index: 0
      })

      themeModel.getAllThemeByType(this.data.index, 'chat', '', (res) => {
         this.setData({
            chatData: res,
            index: this.data.index + 1
         })
      })

      wx.showShareMenu({
         withShareTicket: true
      })
   },

   onReachBottom: function(e) {
      var chatData = this.data.chatData;
      console.log(chatData)

      themeModel.getAllThemeByType(this.data.index, 'chat', '', (res) => {
         if(res.length == 0){
            this.setData({
               nomore: true
            })
            return;
         }
         chatData = chatData.concat(res);
         this.setData({
            chatData: chatData,
            index: this.data.index + 1
         })
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

   onPullDownRefresh() {
      wx.showNavigationBarLoading();
      themeModel.getAllThemeByType(0,'chat', '', (res) => {
         this.setData({
            chatData: res,
            index: 1,
            nomore: false
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

   onClickLike: function(e) {
      var chatId = e.currentTarget.dataset.id;
      var data = this.data.chatData;
      var index = this.getIndex(data, chatId);

      if (data[index].isLike) {
         this.setData({
            ["chatData[" + index + "].like"]: data[index].like - 1,
            ["chatData[" + index + "].isLike"]: !data[index].isLike
         })
      } else {
         this.setData({
            ["chatData[" + index + "].like"]: data[index].like + 1,
            ["chatData[" + index + "].isLike"]: !data[index].isLike
         })
      }

      themeModel.changeLike(chatId)
   },


   onToPost: function(e) {
      wx.navigateTo({
         url: '/pages/post/post?from=' + this.data.currentPage
      })
   },

   //点击评论弹出评论框
   // onShowComment: function(e) {
   //    wx.getSetting({
   //       success: function (res) {
   //          if (!res.authSetting['scope.userInfo']) {
   //             wx.redirectTo({
   //                url: '/pages/login/login?from=chat'
   //             })
   //          }
   //       }
   //    })

   //    var chatId = e.currentTarget.dataset.id;
   //    var data = this.data.chatData;
   //    var index = this.getIndex(data, chatId);

   //    this.setData({
   //       replyData: '',
   //       ["chatData[" + index + "].commenting"]: true
   //    })
   // },

   // closeCommenting: function(e) {
   //    var chatId = e.currentTarget.dataset.id;
   //    var data = this.data.chatData;
   //    var index = this.getIndex(data, chatId);

   //    this.setData({
   //       ["chatData[" + index + "].commenting"]: false,

   //    })
   // },

   //点击发布评论按钮
   // formSubmit: function(e) {
   //    var comment = e.detail.value.comment;
   //    var chatId = e.currentTarget.dataset.id;
   //    var data = this.data.chatData;
   //    var index = this.getIndex(data, chatId);
   //    if (comment.length < 1) {
   //       wx.showToast({
   //          title: '内容不能为空',
   //          icon: 'none'
   //       })
   //       return;
   //    }
   //    themeModel.postComment(chatId, comment, this.data.replyData, (res) => {
   //       if (res) {
   //          //更新评论
   //          this.setData({
   //             ["chatData[" + index + "].comments"]: res,
   //             ["chatData[" + index + "].commenting"]: false
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
   //                url: '/pages/login/login?from=chat'
   //             })
   //          }
   //       }
   //    })
   //    var chatId = e.currentTarget.dataset.id;
   //    var toUserId = e.currentTarget.dataset.toUserId;
   //    var toNickname = e.currentTarget.dataset.toNickname;
   //    var data = this.data.chatData;
   //    var index = this.getIndex(data, chatId);
   //    if (toUserId == wx.getStorageSync('userInfo').id) {
   //       return;
   //    }
   //    this.setData({
   //       ["chatData[" + index + "].commenting"]: true,
   //       replyData: {
   //          toNickname: toNickname,
   //          toUserId: toUserId
   //       }
   //    })
   // },

   getIndex: function(data, chatId) {
      for (var i = 0; i < data.length; i++) {
         if (data[i].id == chatId) {
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