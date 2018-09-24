import {
   Change
} from 'change-model.js';
var change = new Change();

Page({
   data: {
      files: [],
      imageCount: 0,
      disabled: false,
      maxImageCount: 1
   },


   onLoad: function(options) {
      this.setData({
         nickname: options.nickname
      })
   },

   formSubmit: function(e) {

      var value = e.detail.value;
      var files = this.data.files;

      this.setData({
         disabled: true
      })

      wx.showToast({
         title: '提交中...',
         icon: 'loading',
         mask: true,
         duration: 30000
      })

      change.submitAll(value, files, (res) => {
     
         wx.switchTab({
            url: '/pages/my/my'
         })
      })
   },

   chooseImage: function(e) {
      var that = this;
      if (this.data.files.length < this.data.maxImageCount) {
         wx.chooseImage({
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            count: this.data.maxImageCount - this.data.files.length,
            success: function(res) {
               that.setData({
                  files: that.data.files.concat(res.tempFilePaths)
               });
               that.setData({
                  imageCount: that.data.files.length
               });
            }
         })
      }
   },

   previewImage: function(e) {
      wx.previewImage({
         current: e.currentTarget.id, // 当前显示图片的http链接
         urls: this.data.files // 需要预览的图片http链接列表
      })
   },

   deleteImage: function(e) {
      var that = this;
      var files = this.data.files;
      var index = e.currentTarget.dataset.index; //获取当前长按图片下标
      wx.showModal({
         title: '提示',
         content: '确定删除此图片？',
         success: function(res) {
            if (res.confirm) {
               files.splice(index, 1);
            } else if (res.cancel) {
               return false;
            }
            that.setData({
               files,
               imageCount: files.length
            });
         }
      })
   }
})