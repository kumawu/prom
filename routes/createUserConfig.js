var $ = require("mongous").Mongous;
module.exports = function(user) {
    console.log('init config for ', user);
    $("database.collection").find({
        "title": {
            $exists: true
        }
    }, function(r) {
        moduleList = r.documents;
        var allModules = [];
        for (var i = 0, l = moduleList.length; i < l; i++) {
            allModules.push(moduleList[i].id);
        }
        var updateData = {
            user: user,
            moduleList: allModules
        };
        $("database.collection").save(updateData);
        //enabledMod = allModules;
        console.log('finish create user config');
    });

}