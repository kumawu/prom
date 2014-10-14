var nodemailer = require("nodemailer");
var send = function(html, opt) {
    var transport = nodemailer.createTransport({
        host: "mail.staff.sina.com.cn",
        //secure: true, // use SSL
        port: 587, // port for secure SMTP
        auth: {
            user: "wukan",
            pass: "1Q2w3e4r"
        }
    });
    var timeNow = new Date();
    var year = timeNow.getFullYear();　　
    var month = timeNow.getMonth() + 1;　　
    var day = timeNow.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }


    var _date = {
        "date": {
            "y": year,
            "m": month,
            "d": day
        }
    };
    console.log('mail.js log', opt);
    var _cc = (opt.sendName != 'wukan' && opt.sendName != 'kongbo') ? 'wukan' : 'xiaoxia8';
    transport.sendMail({
        from: "wukan@staff.weibo.com",
        to: opt.sendName + "@staff.weibo.com",
        cc: _cc + "@staff.weibo.com",
        subject: "[周报]专业版微博前端开发" + _date.date.m + _date.date.d + _date.date.y,
        html: html
    }, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });


}
module.exports = send;