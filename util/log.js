(function(module) {
    var fs = require('fs');

    function log(content, type) {
        console.log('log util ', type, content);
        if (!type) var type = 'normal';
        switch (type) {
            case 'normal':
                fs.appendFile('./logs/action.log', content, 'utf8');
                break;
            case 'error':
                fs.appendFile('./logs/error.log', content, 'utf8');
                break;
            case 'access':
                fs.appendFile('./logs/access.log', content, 'utf8');
                break;
        }
    }
    module.exports = log;
})(module);