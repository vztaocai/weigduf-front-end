import {Base} from '../../utils/base.js';

class Shetuan extends Base{

   getAllShetuan(callBack)
   {
      var params = {
         url: 'allShetuan',
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }
}
export {Shetuan};