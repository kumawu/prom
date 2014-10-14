var fs = require('fs');
var jade = require('jade');
var getProjects = require('../util/getProjects');
var merge = require('./merge');
module.exports = function(r, opt,cb) {
    var data = fs.readFileSync('views/mail.jade');
    var template = jade.compile(data, 'utf-8');
    var timeNow = new Date();
    var month = timeNow.getMonth() + 1;　　
    var day = timeNow.getDate();
    var beforeDate = calDate(-6);
    var beforeMonth = beforeDate.getMonth() + 1;
    var beforeDay = beforeDate.getDate();

    function calDate(n) {
        var uom = new Date();
        uom.setDate(uom.getDate() + n);
        //uom = uom.getFullYear() + "-" + (uom.getMonth() + 1) + "-" + uom.getDate();
        return uom;
    }
    var _date = {
        "date": {
            "m": month,
            "d": day
        },
        "beforeDate": {
            "m": beforeMonth,
            "d": beforeDay
        }
    };
    var progressList = ['需求评审', '页面构建', '开发中', '联调中', '测试中', '已上线'];
    var step = progressList.length - 1;
    getProjects(function(response) {
        // console.log('getfromDB', response);
        var moduleList = response;
        for (var i = 0, l = r.documents.length; i < l; i++) {
            for (var k = 0, lk = moduleList.length; k < lk; k++) {
                if (moduleList[k].id === r.documents[i].mod_id) {
                    r.documents[i]['moduleName'] = moduleList[k].title;
                    break;
                }
            }

            for (var j = 0, lj = progressList.length; j < lj; j++) {
                if (j !== lj - 1) {
                    if (r.documents[i].state === progressList[j]) {
                        r.documents[i]['percentageAll'] = Math.round(((j / step) + (1 / step * r.documents[i].percentage / 100)) * 100);
                        //console.log('export:::::::::::', r.documents[i]);
                        break;
                    }
                } else {
                    r.documents[i]['percentageAll'] = 100;
                    r.documents[i]['percentage'] = 100;
                }
            }
            for (var j = 0, lj = progressList.length; j < lj; j++) {
                if (j !== lj - 1) {
                    if (r.documents[i].nextState === progressList[j]) {
                        r.documents[i]['nextPerAll'] = Math.round(((j / step) + (1 / step * r.documents[i].nextPer / 100)) * 100);
                        //console.log(r.documents[i]['nextPerAll']);
                        break;
                    }
                } else {
                    r.documents[i]['nextPerAll'] = 100;
                    r.documents[i]['nextPer'] = 100;
                }
            }
        }
        r.documents.sort(function(a, b) {
            //return (a['percentageAll']==b['percentageAll'])?a['mod_id'].localeCompare(b['mod_id']):(b['percentageAll']-a['percentageAll']);
            return (a['mod_id'].localeCompare(b['mod_id']) == 0) ? b['percentageAll'] - a['percentageAll'] : a['mod_id'].localeCompare(b['mod_id'])
        });
        console.log('sorttttttttttt', r.documents);
        var data = merge(r, _date);
        //console.log('rrrrrrrrrr:::::::', r, data);
        data = merge(opt, data);
        //console.log('final data:::::::', data);
        // return template(data);
        cb(template(data));
    });

}