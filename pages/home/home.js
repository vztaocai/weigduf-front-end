import {
   Home
} from 'home-model.js';
var home = new Home();
Page({

   data: {

   },

   onLoad: function(options) {
      home.getBanner((res) => {
         this.setData({
            bannerData: res
         })
      })

      home.getAppId((res) => {
         console.log(res)
         this.setData({
            appId: res
         })
      })

      home.getRecentTheme((res) => {
         for (var i = 0; i < res.length; i++) {
            switch (res[i].type) {
               case 'shiwu':
                  res[i].type = "失物/寻物";
                  break;
               case 'notice':
                  res[i].type = "校内通知";
                  break;
               case 'ershou':
                  res[i].type = "闲置交易";
                  break;
            }
         }
         console.log(res)
         this.setData({
            recentTheme: res
         })
      })
      this.setData({
         nomore: true
      })
      wx.showShareMenu({
         withShareTicket: true
      })
   },

   onShareAppMessage(e)
   { 
      if(e.from == 'button'){
         var content = e.target.dataset.content;
         var themeId = e.target.dataset.themeId;
         var path = '/pages/theme-detail/theme-detail?themeId=' + themeId;

         return {
            title: content,
            path: path,
         }
      }else{
         return {
            title: '教务系统 | 查电费 | 表白墙 | 校内通知 | 失物招领 | 闲置交易 | 图书馆 | 社团组织',
         }
      } 
   },

   // toShare(e)
   // {
   //    var content = e.currentTarget.dataset.content;
   //    var themeId = e.currentTarget.dataset.themeId;
   //    var path = '/pages/theme-detail/theme-detail?themeId=' + themeId;
   //    this.setData({
   //       shareContent: content,
   //       sharePath: path
   //    })
   // },

   toBanner: function(e) {
      var url = e.currentTarget.dataset.url;

      wx.navigateTo({
         url: url,
      })
   },

   onPullDownRefresh() {
      wx.showNavigationBarLoading();
      home.getRecentTheme((res) => {
         for (var i = 0; i < res.length; i++) {
            switch (res[i].type) {
               case 'shiwu':
                  res[i].type = "失物/寻物";
                  break;
               case 'notice':
                  res[i].type = "校内通知";
                  break;
               case 'ershou':
                  res[i].type = "闲置交易";
                  break;
            }
         }
         console.log(res)
         this.setData({
            recentTheme: res
         })
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
   },

   onToPage: function(e) {
      var from = e.currentTarget.dataset.from;

      if (from == 'xiaochengxu') {
         wx.navigateToMiniProgram({
            appId: 'wx727c333bd1be4217',
            path: 'pages/home/home',

            envVersion: 'release',
            success(res) {
               // 打开成功
            }
         })
         return;
      }
      if (from == 'jiaowu') {
         wx.getSystemInfo({
            success: function(res) {
               var system = res.system;
               if (system.indexOf("iOS") != -1) {
                  wx.showModal({
                     title: '提示',
                     content: 'iOS系统暂时无法使用该功能，请从‘WEI广金’公众号下方菜单进入教务系统',
                     showCancel: false,
                     confirmText: '确定',
                     confirmColor: '#a09fed'
                  })
               } else {
                  wx.navigateTo({
                     url: '/pages/jump/jump?from=' + from,
                  })
               }
            },
         })
         return;
      }
      if (from == 'more') {
         wx.navigateTo({
            url: '/pages/more/more',
         })
         return;
      }

      wx.navigateTo({
         url: '/pages/' + from + "/" + from
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

   onClickLike: function(e) {
      var themeId = e.currentTarget.dataset.id;
      var data = this.data.recentTheme;
      var index = this.getIndex(data, themeId);

      if (data[index].isLike) {
         this.setData({
            ["recentTheme[" + index + "].like"]: data[index].like - 1,
            ["recentTheme[" + index + "].isLike"]: !data[index].isLike
         })
      } else {
         this.setData({
            ["recentTheme[" + index + "].like"]: data[index].like + 1,
            ["recentTheme[" + index + "].isLike"]: !data[index].isLike
         })
      }

      home.changeLike(themeId, (res) => {
         // this.setData({
         //    ["recentTheme[" + index + "].like"]: res.likeCount,
         //    ["recentTheme[" + index + "].isLike"]: res.isLike
         // })
      })
   },

   onShare(e){
      console.log(e)
      wx.showShareMenu({
         withShareTicket: true,
         success: function(res) {},
         fail: function(res) {},
         complete: function(res) {},
      })
   },


   // //点击评论弹出评论框
   // onShowComment: function (e) {
   //    wx.getSetting({
   //       success: function (res) {
   //          if (!res.authSetting['scope.userInfo']) {
   //             wx.redirectTo({
   //                url: '/pages/login/login?from=home'
   //             })
   //          }
   //       }
   //    })

   //    var themeId = e.currentTarget.dataset.id;
   //    var data = this.data.recentTheme;
   //    var index = this.getIndex(data, themeId);

   //    this.setData({
   //       replyData: '',
   //       ["recentTheme[" + index + "].commenting"]: true
   //    })
   // },

   // closeCommenting: function (e) {
   //    var themeId = e.currentTarget.dataset.id;
   //    var data = this.data.recentTheme;
   //    var index = this.getIndex(data, themeId);

   //    this.setData({
   //       ["recentTheme[" + index + "].commenting"]: false,

   //    })
   // },

   // //点击发布评论按钮
   // formSubmit: function (e) {
   //    var comment = e.detail.value.comment;
   //    var themeId = e.currentTarget.dataset.id;
   //    var data = this.data.recentTheme;
   //    var index = this.getIndex(data, themeId);
   //    if (comment.length < 1) {
   //       wx.showToast({
   //          title: '内容不能为空',
   //          icon: 'none'
   //       })
   //       return;
   //    }
   //    home.postComment(themeId, comment, this.data.replyData, (res) => {
   //       if (res) {
   //          //更新评论
   //          this.setData({
   //             ["recentTheme[" + index + "].comments"]: res,
   //             ["recentTheme[" + index + "].commenting"]: false
   //          })
   //          wx.showToast({
   //             title: '评论成功',
   //             icon: 'success'
   //          })
   //       }
   //    })
   // },

   // onReply: function (e) {
   //    wx.getSetting({
   //       success: function (res) {
   //          if (!res.authSetting['scope.userInfo']) {
   //             wx.redirectTo({
   //                url: '/pages/login/login?from=home'
   //             })
   //          }
   //       }
   //    })
   //    var themeId = e.currentTarget.dataset.id;
   //    var toUserId = e.currentTarget.dataset.toUserId;
   //    var toNickname = e.currentTarget.dataset.toNickname;
   //    var data = this.data.recentTheme;
   //    var index = this.getIndex(data, themeId);
   //    if (toUserId == wx.getStorageSync('userInfo').id) {
   //       return;
   //    }
   //    this.setData({
   //       ["recentTheme[" + index + "].commenting"]: true,
   //       replyData: {
   //          toNickname: toNickname,
   //          toUserId: toUserId
   //       }
   //    })
   // },

   getIndex: function(data, themeId) {
      for (var i = 0; i < data.length; i++) {
         if (data[i].id == themeId) {
            return i;
         }
      }
   },

   toDetail(e) {
      var themeId = e.currentTarget.dataset.themeId;
      wx.navigateTo({
         url: '/pages/theme-detail/theme-detail?themeId=' + themeId
      })
   },

   toThemeType(e) {
      var themeType = e.currentTarget.dataset.themeType;
      home.toThemeType(themeType);
   }


})