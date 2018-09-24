import {
   MyPost
} from 'mypost-model.js';
var myPost = new MyPost;

Page({


   data: {

   },


   onLoad: function(options) {

      myPost.getMyPost((res) => {
         for (var i = 0; i < res.length; i++) {
            switch (res[i].type) {
               case 'shiwu':
                  res[i].type = "失物/寻物";
                  break;
               case 'chat':
                  res[i].type = "下课聊";
                  break;
               case 'notice':
                  res[i].type = "校内通知";
                  break;
               case 'ershou':
                  res[i].type = "二手市场";
                  break;
            }
         }
         this.setData({
            postData: res
         })
      })
   },

   toDetail(e) {
      var themeId = e.currentTarget.dataset.themeId;
      wx.navigateTo({
         url: '/pages/theme-detail/theme-detail?themeId=' + themeId
      })
   },

   deleteTheme(e) {
      var themeId = e.currentTarget.dataset.themeId;
      var that = this;
      wx.showModal({
         title: '提示',
         content: '确定删除这条帖子吗?',
         showCancel: true,
         cancelText: '取消',
         cancelColor: '#888',
         confirmText: '删除',
         confirmColor: '#a09fed',
         success: function(res) {
            if (res.confirm) {
               myPost.deleteTheme(themeId, (res) => {
                  if (res.error_code == 0) {
                     wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 2000
                     })
                     myPost.getMyPost((res) => {
                        for (var i = 0; i < res.length; i++) {
                           switch (res[i].type) {
                              case 'shiwu':
                                 res[i].type = "失物/寻物";
                                 break;
                              case 'chat':
                                 res[i].type = "下课聊";
                                 break;
                              case 'notice':
                                 res[i].type = "校内通知";
                                 break;
                              case 'ershou':
                                 res[i].type = "二手市场";
                                 break;
                           }
                        }
                        that.setData({
                           postData: res
                        })
                     })
                  }
               })
            }
         }
      })
   },

   onPullDownRefresh() {
      wx.showNavigationBarLoading();
      myPost.getMyPost((res) => {
         for (var i = 0; i < res.length; i++) {
            switch (res[i].type) {
               case 'shiwu':
                  res[i].type = "失物/寻物";
                  break;
               case 'chat':
                  res[i].type = "下课聊";
                  break;
               case 'notice':
                  res[i].type = "校内通知";
                  break;
               case 'ershou':
                  res[i].type = "二手市场";
                  break;
            }
         }
         this.setData({
            postData: res
         })
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
   },

})