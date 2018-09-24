import {Base} from '../../../utils/base.js';

class Change extends Base{
   submitAll(value, files, callBack){
      if(files.length > 0){
         var params = {
            url: 'my/changeUserInfo',
            filePath: files[0],
            name: 'image',
            formData: value,
            sCallBack: function (res) {
               callBack(res);
            }
         }

         this.upload(params);
      }else{
         var params = {
            url: 'my/changeUserInfo',
            type: 'POST',
            data: value,
            sCallBack: function (res) {
               callBack(res);
            }
         }
         this.request(params);
      }
      
   }
} 
export {Change};