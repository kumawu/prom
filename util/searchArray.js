(function(module) {
    module.exports = function(key, source, value) {
        var resultArr = [];
        for (var i = 0, l = source.length; i < l; i++) {
            if ((source[i][key] && !value) || (!!value && source[i][key] == value)) {
                resultArr.push({
                    index: i,
                    arr: source[i]
                });
            }
        }
        if (resultArr.length == 1) {
            return resultArr[0];
        } else {
            return resultArr;
        }
    }
})(module);