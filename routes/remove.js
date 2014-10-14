(function(module) {
    var $ = require("mongous").Mongous;
    var getCurrentUser = require('../util/getCurrentUser');
    var log = require('../util/log');
    var getUsers = require('./getUsers');
    var getConfig = require('./getConfig');
    var rmInArray = require('../util/rmInArray');
    module.exports = function(req, res, io) {

        var user = getCurrentUser(req);
        //console.log('post .js receive post from ',user, req.params, req.param('data'));
        log('remove action from ' + user + ' ' + req.params.id + ' ' + new Date().toLocaleString() + '\n');

        if (req.params.id != 'all') {
            $("database.collection").remove({
                id: req.params.id
            });
            io.emit('remove', {
                user: user,
                id: req.params.id
            });
            //remove project
            if (req.params.id.indexOf('m') > -1) {
                $("database.collection").remove({
                    mod_id: req.params.id
                });
                //还需要update每个user的config
                getUsers(function(response) {
                    var usersArray = response;
                    for (var i = 0, l = usersArray.length; i < l; i++) {
                        getConfig(usersArray[i]['user'], function(res) {
                            var _enableModules = res['moduleList'];
                            if (_enableModules.indexOf(req.params.id) > -1) {
                                var newArray = rmInArray(req.params.id, _enableModules);
                                //这里可能有问题，会把其他config冲掉,以后再考虑同步更新
                                newArray.sort();
                                //console.log('updateeeeeeeeeee', newArray, usersArray[i]);
                                $("database.collection").update({
                                    user: res['user']
                                }, {
                                    user: res['user'],
                                    moduleList: newArray
                                });
                            }
                        })

                    }
                });
            }
        } else {
            //$("database.collection").remove({});
        }
    }
})(module);