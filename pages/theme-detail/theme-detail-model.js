import {
   Base
} from '../../utils/base.js';

class ThemeDetail extends Base {
   getThemeDetail(themeId, callBack) {
      var params = {
         url: 'theme/themeDetail?themeId=' + themeId,
         sCallBack: function(res) {
            callBack(res)
         }
      }
      this.request(params);
   }
   
   changeLike(id, callBack) {
      var params = {
         url: 'theme/like?themeId=' + id,
         sCallBack: function(res) {
            callBack(res)
         }
      }
      this.request(params);
   }

   postComment(themeId, comment, replyData = '', formId, callBack) {

      var params = {
         url: 'theme/comment?themeId=' + themeId,
         type: 'POST',
         data: {
            comment: comment,
            toUserId: replyData ? replyData['toUserId'] : 0,
            toNickname: replyData ? replyData['toNickname'] : '',
            formId: formId
         },
         sCallBack: function(res) {
            callBack(res)
         }
      }
      // console.log(params)
      this.request(params);
   }

   deleteComment(themeId, commentId, callBack){
      var params = {
         url: 'theme/deleteComment',
         data: {
            themeId: themeId,
            commentId: commentId,
         },
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }
}


export {
   ThemeDetail
}