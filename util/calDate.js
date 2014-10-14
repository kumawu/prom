(function(module) {

    function calDate(n) {
        var uom = new Date();
        uom.setDate(uom.getDate() + n);
        //uom = uom.getFullYear() + "-" + (uom.getMonth() + 1) + "-" + uom.getDate();
        return uom;
    }
    module.exports = function(n) {
        var timeNow = new Date();
        var year = timeNow.getFullYear();
        var month = timeNow.getMonth() + 1;
        var day = timeNow.getDate();

        var beforeDate = calDate(n);
        var beforeMonth = beforeDate.getMonth() + 1;
        var beforeDay = beforeDate.getDate();
        var beforeYear = beforeDate.getFullYear();

        return {
            now: {
                year: year,
                month: month,
                day: day
            },
            before: {
                year: beforeYear,
                month: beforeMonth,
                day: beforeDay
            }
        }
    }
})(module);