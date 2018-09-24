import {
   Base
} from '../../utils/base.js';

class Post extends Base {

   submitAll(value, files, from, callBack) {
      var sucCount = 0;
      //有图情况
      if (files.length > 0) {
         for (var i = 0; i < files.length; i++) {
               var params = {
                  url: 'theme/post?type='+ from,
                  filePath: files[i],
                  name: 'image',
                  formData: value,
                  sCallBack: function(res) {
                     callBack(res);
                  }
               }
            this.upload(params);
         }
         //以下是无图的情况
      }else{
            var params = {
               url: 'theme/post?type=' + from,
               type: "POST",
               data: value,
               sCallBack: function (res) {
                  callBack(res);
               }
            }
        
         this.request(params);
      }
   }
   /**
    * 表白墙验证器
    */
   biaobaiValidate(value, files) {
      if (value.content.length < 3) {
         wx.showToast({
            title: '请输入至少3个字符',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
         })
         return false;
      } else if (files.length < 1) {
         wx.showToast({
            title: '请选择一张图片',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
         })
         return false;
      } else {
         return true;
      }
   }
   /**
    * 闲置二手验证器
    */
   ershouValidate(value) {
      if (value.content.length < 3) {
         wx.showToast({
            title: '请输入至少3个字符',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
         })
         return false;
      } else {
         return true;
      }
   }
   /**
    * 校内通知验证器
    */
   noticeValidate(value) {
      if (value.content.length < 3) {
         wx.showToast({
            title: '请输入至少3个字符',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
         })
         return false;
      } else {
         return true;
      }
   }
   /**
    * 失物招领验证器
    */
   shiwuValidate(value, files) {
      console.log(value)
      if (value.from == '') {
         wx.showToast({
            title: '请选择失物招领或是寻物启事',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
         })
         return false;
      } else if (value.content.length < 10) {
         wx.showToast({
            title: '请输入至少10个字符',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
         })
         return false;
      } else {
         return true;
      }
   }
}

export {
   Post
};