var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

import {
   ThemeModel
} from '../../utils/theme-model.js';
var themeModel = new ThemeModel();

Page({
   data: {
      currentPage: "shiwu",
      tabs: ["失物招领", "寻物启事"],
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      shiwuIndex: 0,
      xunwuIndex: 0,
      shiwuNomore: false,
      xunwuNomore: false
   },

   onLoad: function() {
      //上方tab
      var that = this;
      wx.getSystemInfo({
         success: function(res) {
            that.setData({
               sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
               sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
         }
      })

      themeModel.getAllThemeByType(this.data.shiwuIndex, 'shiwu', 'shiwu', (res) => {
         console.log(res)
         this.setData({
            shiwuData: res,
            shiwuIndex: this.data.xunwuIndex + 1
         })
      })

      themeModel.getAllThemeByType(this.data.xunwuIndex, 'shiwu', 'xunwu', (res) => {
         this.setData({
            xunwuData: res,
            xunwuIndex: this.data.xunwuIndex + 1
         })
      })

      wx.showShareMenu({
         withShareTicket: true
      })
   },

   onReachBottom: function (e) {
      var activeIndex = this.data.activeIndex;
      var currentData = activeIndex == 0 ? this.data.shiwuData : this.data.xunwuData;
      var from = activeIndex == 0 ? 'shiwu' : 'xunwu';
      var index = activeIndex == 0 ? this.data.shiwuIndex : this.data.xunwuIndex;

      

      themeModel.getAllThemeByType(index, 'shiwu', from, (res) => {
         if (res.length == 0) {
            this.setData({
               [from + "Nomore"]: true
            })
            return;
         }
         currentData = currentData.concat(res);
         this.setData({
            [from + "Data"]: currentData,
            [from + "Index"]: index + 1
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
      themeModel.getAllThemeByType(0, 'shiwu', 'shiwu', (res) => {
         this.setData({
            shiwuData: res,
            shiwuIndex: 1,
            shiwuNomore: false
         })
      })

      themeModel.getAllThemeByType(0, 'shiwu', 'xunwu', (res) => {
         this.setData({
            xunwuData: res,
            xunwuIndex: 1,
            xunwuNomore: false
         })
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();

   },
   //点击上方tab
   tabClick: function(e) {
      this.setData({
         sliderOffset: e.currentTarget.offsetLeft,
         activeIndex: e.currentTarget.id
      });
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
      var shiwuId = e.currentTarget.dataset.id;
      var from = e.currentTarget.dataset.from;
      var data = from == 'shiwu' ? this.data.shiwuData : this.data.xunwuData;
      var index = this.getIndex(data, shiwuId);

      if (data[index].isLike) {
         this.setData({
            [from + "Data[" + index + "].like"]: data[index].like - 1,
            [from + "Data[" + index + "].isLike"]: !data[index].isLike
         })
      } else {
         this.setData({
            [from + "Data[" + index + "].like"]: data[index].like + 1,
            [from + "Data[" + index + "].isLike"]: !data[index].isLike
         })
      }

      themeModel.changeLike(shiwuId)
   },

   //跳转到发布页面
   onToPost: function(e) {
      wx.redirectTo({
         url: '/pages/post/post?from=' + this.data.currentPage
      })
   },

   //点击评论弹出评论框
   // onShowComment: function(e) {
   //    wx.getSetting({
   //       success: function (res) {
   //          if (!res.authSetting['scope.userInfo']) {
   //             wx.redirectTo({
   //                url: '/pages/login/login?from=shiwu'
   //             })
   //          }
   //       }
   //    })
   //    var shiwuId = e.currentTarget.dataset.id;
   //    var from = e.currentTarget.dataset.from;
   //    var data = from == 'shiwu' ? this.data.shiwuData : this.data.xunwuData;
   //    var index = this.getIndex(data, shiwuId);

   //    this.setData({
   //       replyData: '',
   //       [from + "Data[" + index + "].commenting"]: true
   //    })
   // },

   // closeCommenting: function(e) {
   //    var from = e.currentTarget.dataset.from;
   //    var shiwuId = e.currentTarget.dataset.id;
   //    var data = from == 'shiwu' ? this.data.shiwuData : this.data.xunwuData;
   //    var index = this.getIndex(data, shiwuId);

   //    this.setData({
   //       [from + "Data[" + index + "].commenting"]: false,
         
   //    })
   // },

   // //点击发布评论按钮
   // formSubmit: function(e) {
   //    var comment = e.detail.value.comment;
   //    var shiwuId = e.currentTarget.dataset.id;
   //    var from = e.currentTarget.dataset.from;
   //    var data = from == 'shiwu' ? this.data.shiwuData : this.data.xunwuData;
   //    var index = this.getIndex(data, shiwuId);
   //    if(comment.length < 1){
   //       wx.showToast({
   //          title: '内容不能为空',
   //          icon: 'none'
   //       })
   //       return;
   //    }
   //    themeModel.postComment(shiwuId, comment, this.data.replyData, (res) => {
   //       if (res) {
   //          //更新评论
   //          this.setData({
   //             [from + "Data[" + index + "].comments"]: res,
   //             [from + "Data[" + index + "].commenting"]: false
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
   //                url: '/pages/login/login?from=shiwu'
   //             })
   //          }
   //       }
   //    })
   //    var shiwuId = e.currentTarget.dataset.id;
   //    var from = e.currentTarget.dataset.from;
   //    var toUserId = e.currentTarget.dataset.toUserId;
   //    var toNickname = e.currentTarget.dataset.toNickname;
   //    var data = from == 'shiwu' ? this.data.shiwuData : this.data.xunwuData;
   //    var index = this.getIndex(data, shiwuId);
   //    if(toUserId == wx.getStorageSync('userInfo').id){
   //       return;
   //    }
   //    this.setData({
   //       [from + "Data[" + index + "].commenting"]: true,
   //       replyData: {
   //          toNickname: toNickname,
   //          toUserId: toUserId
   //       }
   //    })
   // },

   getIndex: function(data, shiwuId) {
      for (var i = 0; i < data.length; i++) {
         if (data[i].id == shiwuId) {
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