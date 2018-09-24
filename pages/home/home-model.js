import {Base} from '../../utils/base.js';

class Home extends Base{
   getRecentTheme(callBack){
      var params = {
         url: 'theme/recentTheme',
         sCallBack: function(res){
            callBack(res);
         }
      }
      this.request(params);
   }

   getAppId(callBack){
      var params = {
         url: 'appId',
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }
   
   getBanner(callBack){
      var params = {
         url: 'banner/allBanner',
         sCallBack: function(res){
            callBack(res)
         }
      }
      this.request(params);
   }

   
   changeLike(id, callBack) {
      var params = {
         url: 'theme/like?themeId=' + id,
         sCallBack: function (res) {
            callBack(res)
         }
      }
      this.request(params);
   }

   postComment(ershouId, comment, replyData = '', callBack) {

      var params = {
         url: 'theme/comment?themeId=' + ershouId,
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

   toThemeType(themeType){
      switch (themeType) {
         case '失物/寻物': wx.navigateTo({
            url: '/pages/shiwu/shiwu',
         }); break;
         case '校内通知': wx.navigateTo({
            url: '/pages/notice/notice',
         }); break;
         case '闲置交易': wx.navigateTo({
            url: '/pages/ershou/ershou',
         }); break;
      }
   }
}
export {Home};