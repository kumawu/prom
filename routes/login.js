var ldap = require('ldapjs');

var client = ldap.createClient({
    url: 'ldap://10.210.97.21:389'
});
// function(){
//             res.send('Passed');
//         },function(){
//             res.send('Not Pass.');
//         }
function login(mail,pwd,res) {
    console.log(mail,'login...');
    client.bind(mail, pwd, function(err) {
        if (err) {
            console.log('login error! ' + err);
            res.send('Not Pass.');
        } else {
            
            // console.log('login success!');
            client.unbind(function(err) {
                // console.log("close!");
                res.send('Passed');
            });
        }
    });

}
module.exports = login;