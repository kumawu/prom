var createUserConfig = require('../routes/createUserConfig');
var $ = require("mongous").Mongous;
module.exports = function(user, cb) {
    //console.log('routes.getConfig trying to get user config for',user);
    if (typeof user != 'string') return;
    $("database.collection").find({
        "user": user
    }, function(r) {
        if (r.numberReturned != 0) {
            cb(r.documents[0]);
        } else { //這裡會有一個bug，在創建用戶后，没有执行回调，不过几率非常小
            createUserConfig(user);
        }
        //console.log(r.documents[0]);
    });
}