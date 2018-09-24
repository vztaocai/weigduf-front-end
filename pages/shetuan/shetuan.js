import {Shetuan} from 'shetuan-model.js';
var shetuan = new Shetuan();

Page({

   data: {

   },

   onLoad: function(options) {
      shetuan.getAllShetuan((res)=>{
         console.log(res)
         this.setData({
            shetuanData: res
         })
      })

      wx.showShareMenu({
         withShareTicket: true
      })
   },

   toButtonGroup: function(e){
      wx.navigateTo({
         url: 'button-group/button-group'
      })
   },

   toArticle: function(e){
      var id = e.currentTarget.dataset.id;
      console.log(e)
      wx.navigateTo({
         url: 'article/article?id=' + id,
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
   //diyici

})