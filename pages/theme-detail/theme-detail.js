import {
   ThemeDetail
} from 'theme-detail-model.js';
var themeDetail = new ThemeDetail();

Page({

   data: {

   },

   onLoad: function(options) {
      var userId = wx.getStorageSync('userInfo').id;
      var themeId = options.themeId;
      themeDetail.getThemeDetail(themeId, (res) => {
         this.setData({
            themeId: themeId,
            themeData: res,
            userId: userId
         })
      })
      wx.showShareMenu({
         withShareTicket: true
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
      var themeId = e.currentTarget.dataset.themeid;
      if (this.data.themeData['isLike']) {
         this.setData({
            ["themeData.like"]: this.data.themeData['like'] - 1,
            ["themeData.isLike"]: !this.data.themeData['isLike']
         })
      } else {
         this.setData({
            ["themeData.like"]: this.data.themeData['like'] + 1,
            ["themeData.isLike"]: !this.data.themeData['isLike']
         })
      }

      themeDetail.changeLike(themeId, (res) => {
         // this.setData({
         //    ["themeData.like"]: res.likeCount,
         //    ["themeData.isLike"]: res.isLike
         // })
      })
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


   //点击发布评论按钮
   formSubmit: function(e) {
      var comment = e.detail.value.comment;
      var themeId = e.currentTarget.dataset.id;
      var formId = e.detail.formId;
      wx.getSetting({
         success: function(res) {
            if (!res.authSetting['scope.userInfo']) {
               wx.redirectTo({
                  url: '/pages/login/login?from=themeDetail&themeId=' + themeId
               })
            }
         }
      })

      if (comment.length < 1) {
         wx.showToast({
            title: '内容不能为空',
            icon: 'none'
         })
         return;
      }
      themeDetail.postComment(themeId, comment, this.data.replyData, formId, (res) => {
         if (res) {
            console.log(res)
            //更新评论
            this.setData({
               ["themeData.comments"]: res,
               ["themeData.comment_count"]: this.data.themeData['comment_count'] + 1,
               searchinput: ''
            })
            wx.showToast({
               title: '评论成功',
               icon: 'success'
            })
         }
      })
   },

   onReply: function(e) {
      var themeId = e.currentTarget.dataset.id;
      var toUserId = e.currentTarget.dataset.toUserId;
      var toNickname = e.currentTarget.dataset.toNickname;
      wx.getSetting({
         success: function(res) {
            if (!res.authSetting['scope.userInfo']) {
               wx.redirectTo({
                  url: '/pages/login/login?from=themeDetail&themeId=' + themeId
               })
            }
         }
      })

      if (toUserId == wx.getStorageSync('userInfo').id) {
         return false;
      }
      this.setData({
         searchinput: '',
         replyData: {
            toNickname: toNickname,
            toUserId: toUserId
         }
      })
   },

   watchInput(e) {

      if (e.detail.cursor == 0) {
         this.setData({
            isInputing: false
         })
      } else {
         this.setData({
            isInputing: true
         })
      }

   },

   cancelReply(e) {
      this.setData({
         searchinput: '',
         replyData: ''
      })
   },


   getIndex: function(data, noticeId) {
      for (var i = 0; i < data.length; i++) {
         if (data[i].id == noticeId) {
            return i;
         }
      }
   },


   onPullDownRefresh() {
      wx.showNavigationBarLoading();

      var userId = wx.getStorageSync('userInfo').id;

      themeDetail.getThemeDetail(this.data.themeId, (res) => {
         this.setData({
            themeData: res,
            userId: userId
         })
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
   },

   returnHome(e) {
      wx.switchTab({
         url: '/pages/home/home'
      })
   },

   deleteComment(e) {
      var that = this;
      wx.showModal({
         title: '提示',
         content: '确定删除此评论吗?',
         showCancel: true,
         cancelText: '取消',
         cancelColor: '#888',
         confirmText: '删除',
         confirmColor: '#a09fed',
         success: function(res) {
            if (res.confirm) {
               var commentId = e.currentTarget.dataset.commentId;
               var themeId = that.data.themeId;
               var comments = that.data.themeData.comments;

               themeDetail.deleteComment(themeId, commentId, (res) => {
                  if (res.error_code == 0) {
                     wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000,
                        mask: true
                     })
                     for (var i = 0; i < comments.length; i++) {
                        if (comments[i].id == commentId) {
                           comments.splice(i, 1);
                        }
                     }
                     that.setData({
                        'themeData.comments': comments,
                        'themeData.comment_count': that.data.themeData.comment_count - 1
                     })
                  }
               })
            }else if(res.cancel){
               return false;
            }
         }
      })
   }
})