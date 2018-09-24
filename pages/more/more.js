// pages/more/more.js
Page({

   data: {

   },


   onLoad: function(options) {
      wx.showShareMenu({
         withShareTicket: true
      })
   },

   onToPage: function(e) {
      var from = e.currentTarget.dataset.from;

      if (from == 'book') {
         wx.getSystemInfo({
            success: function(res) {
               var system = res.system;
               if (system.indexOf("iOS") != -1) {
                  wx.showModal({
                     title: '提示',
                     content: 'iOS系统暂时无法使用该功能，请从‘WEI广金’公众号下方菜单进入图书馆系统',
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

      if (from == 'tice') {
         wx.getSystemInfo({
            success: function(res) {
               var system = res.system;
               wx.showModal({
                  title: '提示',
                  content: '暂时无法使用该功能，请从‘WEI广金’公众号下方菜单进入体测成绩查询',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor: '#a09fed'
               })
            },
         })
         return;
      }

      if (from == 'advice') {
         wx.navigateTo({
            url: '/pages/post/post?from=advice',
         })
         return;
      }
      wx.navigateTo({
         url: '/pages/' + from + "/" + from
      })
   },


})