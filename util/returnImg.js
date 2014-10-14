(function(module) {
    var dirWalker = require('./dirWalker');
    module.exports = function(req,res) {
        var files = dirWalker('./prom/images/bg').other;
        res.sendfile(files[parseInt(Math.random()*files.length)]);
    }
})(module);