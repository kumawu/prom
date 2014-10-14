(function(module) {
    //var searchArray = require('../util/searchArray');
    var $ = require("mongous").Mongous;
    var getConfig = require('../routes/getConfig');
    var rmInArray = require('../util/rmInArray');
    module.exports = function(opt) {
        var user = opt.user || '';
        var value = opt.value || '';
        var configItem = opt.configItem || '';
        var type = opt.type || '';
        var cb = opt.cb || function() {};

        getConfig(user, function(response) {
            var _userConfig = response;
            console.log('util setConfig ',user,response,configItem,value,type);
            if (type == 'change') {
                _userConfig[configItem] = [value];
            } else if (type == 'add') {
                if (_userConfig[configItem].indexOf(value) == -1) {
                    _userConfig[configItem].push(value);
                }
            } else if (type == "rm") {
                var newArray = rmInArray(value, _userConfig[configItem]);
                console.log('newArrayyyyyyy', newArray);
                _userConfig[configItem] = newArray;
            }else{
                return;
            }
            _userConfig[configItem].sort();
            $("database.collection").update({
                user: user
            }, _userConfig);
            cb(_userConfig);
        })

    }
})(module);