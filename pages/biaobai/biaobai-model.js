import {Base} from '../../utils/base.js';

class Biaobai extends Base{

   getAllBiaobai(index, callBack)
   {
      var params = {
         url: 'theme/allThemeByType/biaobai',
         data: {
            index: index
         },
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }
}
export {Biaobai};