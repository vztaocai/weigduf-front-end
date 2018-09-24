import {Base} from '../../../utils/base.js';

class MyPost extends Base{

   getMyPost(callBack){
      var params = {
         url: 'my/myPost',
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }

   deleteTheme(themeId, callBack){
      var params = {
         url: 'my/deleteTheme?themeId='+themeId,
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }
}

export {MyPost};