export function checkBrowser() {
  var UserAgent = navigator.userAgent.toLowerCase();
  var browser = null;
  var browserArray = {
    IE: window.ActiveXObject || 'ActiveXObject' in window, // IE
    Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1, // Chrome浏览器
    Firefox: UserAgent.indexOf('firefox') > -1, // 火狐浏览器
    Opera: UserAgent.indexOf('opera') > -1, // Opera浏览器
    Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1, // safari浏览器
    Edge: UserAgent.indexOf('edg') > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(UserAgent), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(UserAgent), // 微信浏览器
  };
  for (var i in browserArray) {
    if (browserArray[i]) {
      var versions = '';
      if (i == 'IE') {
        versions = UserAgent.match(/(msie\s|trident.*rv:)([\w.]+)/)[2];
      } else if (i == 'Chrome') {
        for (var mt in navigator.mimeTypes) {
          if (navigator.mimeTypes[mt]['type'] == 'application/360softmgrplugin') {
            i = '360';
          }
        }
        versions = UserAgent.match(/chrome\/([\d.]+)/)[1];
      } else if (i == 'Firefox') {
        versions = UserAgent.match(/firefox\/([\d.]+)/)[1];
      } else if (i == 'Opera') {
        versions = UserAgent.match(/opera\/([\d.]+)/)[1];
      } else if (i == 'Safari') {
        versions = UserAgent.match(/version\/([\d.]+)/)[1];
      } else if (i == 'Edge') {
        versions = UserAgent.match(/edg\/([\d.]+)/)[1];
      } else if (i == 'QQBrowser') {
        versions = UserAgent.match(/qqbrowser\/([\d.]+)/)[1];
      }
      browser = i + ' ' + versions;
    }
  }
  return browser;
}
