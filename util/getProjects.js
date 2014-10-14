var $ = require("mongous").Mongous;
module.exports = function(cb) {
    $("database.collection").find({
        "title": {
            $exists: true
        }
    }, function(r) {
        cb(r.documents);
    });
}