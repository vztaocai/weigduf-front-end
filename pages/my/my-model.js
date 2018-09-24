import {Base} from '../../utils/base.js';

class My extends Base{
   getMyData(callBack){
      var params = {
         url: 'my/myData',
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }
}

export {My};