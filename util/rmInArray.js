(function(module) {
    module.exports = function(v, arr) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === v) {
                arr.splice(i, 1);
                break;
            }
        }
        return arr;
    }
})(module);