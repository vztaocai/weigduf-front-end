import {Base} from '../../../utils/base.js';
class Article extends Base{
   getArticle(id, callBack){
      var params = {
         url: 'shetuan?id=' + id,
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params)
   }
}
export {Article};