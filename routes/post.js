(function(module) {
    var $ = require("mongous").Mongous;
    var getCurrentUser = require('../util/getCurrentUser');
    var log = require('../util/log');
    var merge = require('../util/merge');
    var setConfig = require('../util/setConfig');

    module.exports = function(req, res, io) {

        var user = getCurrentUser(req);
        if (user == 'undefined'||!user) {
            return;
        }
        //console.log('post .js receive post from ',user, req.params, req.param('data'));
        log('receive post from ' + user + ' ' + JSON.stringify(req.param('data')) + ' ' + new Date().toLocaleString() + '\n');
        var id = req.params.id;
        $("database.collection").find({
            "id": id
        }, function(r) {
            if (r.numberReturned != 0) {
                //console.log('updating......',r.documents,'==========>',merge({id: req.params.id}, req.param('data')));
                $("database.collection").update({
                    id: req.params.id
                }, merge({
                    id: req.params.id
                }, req.param('data')));
            } else {
                console.log('saveing new data for ', req.params.id);
                $("database.collection").save(merge({
                    id: req.params.id
                }, req.param('data')));
            }
            io.emit('update post', {
                user: user,
                data: req.param('data')
            });
            //handle module
            if(id.indexOf('m') > -1 ){
                setConfig({
                    user:user,
                    type:'add',
                    value:id,
                    configItem : 'moduleList',
                    cb:function(response){
                        res.send(response);
                    }
                });
            }else{
                res.send({id:req.params.id,data:req.param('data'),user:user});
            }
        });

        //console.log('trying to save to database');
        
    }
})(module);