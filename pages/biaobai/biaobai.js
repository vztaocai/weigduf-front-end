import {
   Biaobai
} from 'biaobai-model.js';
var biaobai = new Biaobai();

Page({

   data: {
      currentPage: "biaobai",
      index: 0,
      nomore: false
   },

   onLoad: function(options) {
      biaobai.getAllBiaobai(this.data.index,(res) => {
         console.log(res)
         this.setData({
            biaobaiList: res,
            index: this.data.index+1,
         })
      })
      wx.showShareMenu({
         withShareTicket: true
      })
   },

   onReachBottom: function (e) {
      var biaobaiList = this.data.biaobaiList;

      biaobai.getAllBiaobai(this.data.index, (res) => {
         if (res.length == 0) {
            this.setData({
               nomore: true
            })
            return;
         }
         biaobaiList = biaobaiList.concat(res);
         this.setData({
            biaobaiList: biaobaiList,
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
      biaobai.getAllBiaobai(0, (res) => {
         this.setData({
            biaobaiList: res,
            index: 1,
            nomore: false
         })
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
   },

   //跳转到发布页面
   onToPost: function(e) {
      wx.navigateTo({
         url: '/pages/post/post?from=' + this.data.currentPage
      })
   },

   // preImage: function (e) {
   //    var src = e.currentTarget.dataset.src;
   //    var imgUrlArr = [];
   //    imgUrlArr.push(src);
   //    wx.previewImage({
   //       current: src,
   //       urls: imgUrlArr
   //    })
   // },

})