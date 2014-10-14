(function(module) {
    var $ = require("mongous").Mongous;
    var getCurrentUser = require('../util/getCurrentUser');
    var log = require('../util/log');

    var setConfig = require('../util/setConfig');

    module.exports = function(req, res, io) {

        var user = getCurrentUser(req);
        if (user == 'undefined') {
            return;
        }
        //console.log('post .js receive post from ',user, req.params, req.param('data'));
        log('receive post from ' + user + ' ' + JSON.stringify(req.param('data')) + ' ' + new Date().toLocaleString() + '\n');
        var id = req.params.id;
        
        var configItem = req.params.config;
        var value = req.query.value;
        var type = req.params.type || 'add';

        setConfig({
            user:user,
            value:value,
            type:type,
            configItem:configItem
        })
        // var index = searchArray('user', userConfig, user).index;
        // var _userConfig = userConfig[index];
        // //var index = searchArray(configItem, _userConfig).index;
        // console.log('setConfig', userConfig, configItem, searchArray(configItem, userConfig));

        // console.log('change configItem', userConfig, index)
        // if (type == 'change') {
        //     userConfig[index][configItem] = [value];
        // } else if (type == 'add') {
        //     if (userConfig[index][configItem].indexOf(value) == -1) {
        //         userConfig[index][configItem].push(value);
        //     }
        // } else if (type == "rm") {
        //     var newArray = rmInArray(value, userConfig[index][configItem]);
        //     console.log('newArrayyyyyyy', newArray);
        //     userConfig[index][configItem] = newArray;
        // }
        // userConfig[index][configItem].sort();
        // $("database.collection").update({
        //     user: user
        // }, userConfig[index]);
        //}
        //console.log('action done', userConfig[index]);
        //res.send(userConfig[index]);
        //io.socket.emit()

        //console.log('trying to save to database');
        res.send({
            id: req.params.id,
            data: req.param('data'),
            user: user
        });
    }
})(module);