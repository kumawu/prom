 (function(module) {
    function parseCookie(cookie) {
        var cookies = {};
        if (!cookie) {
            return cookies
        }
        var list = cookie.split(';');
        for (var i = 0, l = list.length; i < l; i++) {
            var pair = list[i].split('=');
            cookies[pair[0].trim()] = pair[1];
        }
        return cookies;
    };

     module.exports = function(req) {
         var cookies = parseCookie(req.headers.cookie);
         return cookies.username;
     }
 })(module);