Page({

   data: {

   },


   onLoad: function(options) {
      wx.showShareMenu({
         withShareTicket: true
      })
   },

   toArticle(e){
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
         url: '/pages/shetuan/article/article?id='+id,
         success: function(res) {},
         fail: function(res) {},
         complete: function(res) {},
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




})