import {
   Config
} from 'config.js';
import {
   Token
} from 'token.js';


class Base {
   constructor() {
      this.baseRequestUrl = Config.restUrl;
   }

   request(params, noRefetch = false) {
      var url = this.baseRequestUrl + params.url;
      var that = this;
      if (!params.type) {
         params.type = 'GET';
      }

      wx.request({
         url: url,
         data: params.data,
         method: params.type,
         header: {
            'content-type': 'application/json',
            'token': wx.getStorageSync('token')
         },
         success: function(res) {
            var code = res.statusCode.toString();
            var startChar = code.charAt(0);

            if (startChar == '2') {
               params.sCallBack && params.sCallBack(res.data);
            }else {
               if (code == '401') {
                  if (!noRefetch) {
                     that._refetch_request(params);
                  }
               }
               params.eCallBack && params.eCallBack(res);
            }
         },
         fail: function(res) {
            console.log(res);
         }
      })
   }

   _refetch_request(params) {
      var token = new Token();
      token.getTokenFromServer((token) => {
         this.request(params, true);
      })
   }

   upload(params, noRefetch = false) {
      var url = this.baseRequestUrl + params.url;
      var that = this;

      wx.uploadFile({
         url: url,
         filePath: params.filePath,
         name: params.name,
         header: {
            'content-type': 'multipart/form-data',
            'token': wx.getStorageSync('token')
         },
         formData: params.formData,
         success: function(res) {
            var code = res.statusCode.toString();
            var startChar = code.charAt(0);

            if (startChar == '2') {
               params.sCallBack && params.sCallBack(res);
            } else {
               if (code == '401') {
                  if (!noRefetch) {
                     that._refetch_upload(params);
                  }
               }
               params.eCallBack && params.eCallBack(res);
            }
         },
         fail: function(res) {
            console.log(res);
         }
      })
   }

   _refetch_upload(params) {
      var token = new Token();
      token.getTokenFromServer((token) => {
         this.upload(params, true);
      })
   }

}

export {
   Base
};