import {
   Post
} from 'post-model.js';
import {
   Login
} from '../login/login-model.js';

var login = new Login();
var post = new Post();

Page({
   data: {
      files: [],
      imageCount: 0,
      disabled: false,
      isAnonymous: false
   },

   onLoad: function(options) {

      wx.getSetting({
         success: function(res) {
            if (!res.authSetting['scope.userInfo']) {
               wx.redirectTo({
                  url: '/pages/login/login?from=' + options.from
               })
            } else {
               login.getUserInfo((res) => {
                  wx.setStorageSync('userInfo', res);
               })
            }
         }
      })

      if (options.from == "shiwu" || options.from == "ershou" || options.from == "notice" || options.from == "chat" || options.from == "advice") {
         this.setData({
            from: options.from,
            maxImageCount: 6
         })
      } else if (options.from == "biaobai") {
         this.setData({
            from: options.from,
            maxImageCount: 1
         })
      }
   },
   switchChange: function(e) {
      var value = e.detail.value;
      this.setData({
         isAnonymous: value
      })
   },
   formSubmit: function(e) {

      var value = e.detail.value;
      value['formId'] = e.detail.formId;
      value['isAnonymous'] = this.data.isAnonymous ? 1 : 0;

      var files = this.data.files;
      var from = this.data.from;
      var sucCount = 0;

      switch (from) {
         case 'biaobai':
            if (!post.biaobaiValidate(value, files)) {
               return;
            };
            break;
         case 'shiwu':
            if (!post.shiwuValidate(value, files)) {
               return;
            }
            break;
         case 'ershou':
            if (!post.ershouValidate(value)) {
               return;
            };
            break;
         case 'notice':
            if (!post.noticeValidate(value)) {
               return;
            }
            break;
         case 'chat':
            if (!post.noticeValidate(value)) {
               return;
            }
            break;
         case 'advice':
            if (!post.noticeValidate(value)) {
               return;
            }
            break;
      }


      this.setData({
         disabled: true
      })
      wx.showToast({
         title: '上传中...',
         icon: 'loading',
         mask: true,
         duration: 30000
      })
      post.submitAll(value, files, from, (res) => {
         console.log(res)
         if (files.length > 0) {
            sucCount = this.uploading(res, sucCount, files.length, from)
         } else {
            if (from == 'chat') {
               wx.switchTab({
                  url: '/pages/chat/chat'
               })
               return;
            }
            if (from == 'advice') {
               wx.redirectTo({
                  url: '/pages/more/more',
               })
               return;
            }
            wx.redirectTo({
               url: '/pages/' + from + '/' + from
            })
         }
      })
   },

   // 上传文件中, res是上传每张图片时返回的结果,
   // sucCount用于计算上传成功数
   // filesLength用于显示上传到第几张的效果
   //from为上传成功后跳转的页面
   uploading(res, sucCount, filesLength, from) {
      if (res.statusCode == 201) {
         sucCount++;
      }

      wx.showToast({
         title: '上传中...' + sucCount + '/' + filesLength,
         icon: 'loading',
         mask: true,
         duration: 30000
      })

      if (sucCount == this.data.files.length) {
         wx.hideToast()
         if (from == 'chat') {
            wx.switchTab({
               url: '/pages/chat/chat'
            })
            return;
         }
         if (from == 'advice') {
            wx.redirectTo({
               url: '/pages/more/more',
            })
            return;
         }

         wx.redirectTo({
            url: '/pages/' + from + '/' + from
         })
      }
      return sucCount;
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