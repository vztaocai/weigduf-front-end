import { Base } from 'base.js';

class ThemeModel extends Base {

   getAllThemeByType(index, type, from='', callBack) {
      
      if(from){
         var url = 'theme/allThemeByType/' + type + '?from=' + from;
      }else{
         var url = 'theme/allThemeByType/' + type;
      }

      var params = {
         url: url,
         data: {
            index: index
         },
         sCallBack: function (res) {
            callBack(res)
         }
      }
      this.request(params);
   }

   changeLike(id) {
      var params = {
         url: 'theme/like?themeId=' + id,
         sCallBack: function (res) {
            callBack(res)
         }
      }
      this.request(params);
   }

   postComment(chatId, comment, replyData = '', callBack) {
      var params = {
         url: 'theme/comment?themeId=' + chatId,
         type: 'POST',
         data: {
            comment: comment,
            toUserId: replyData ? replyData['toUserId'] : '',
            toNickname: replyData ? replyData['toNickname'] : ''
         },
         sCallBack: function (res) {
            callBack(res)
         }
      }
      this.request(params);
   }

   
}

export { ThemeModel };