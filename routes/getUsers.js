var $ = require("mongous").Mongous;
module.exports = function(cb) {
    console.log('routes.getUsers trying to get users');
    $("database.collection").find({
        "user": {
            $exists: true
        }
    }, function(r) {
        cb(r.documents);
    });
}