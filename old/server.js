var fs = require('fs');
var request = require('request');
var thunkify = require('thunkify');

var koa = require('koa');
var jade = require('jade');
var router = require('koa-router')
var app = koa();

var request = thunkify(request);
var readFile = thunkify(fs.readFile);
var $ = require("mongous").Mongous;
$.find=thunkify($("database.collection").find);

/*var data = fs.readFileSync('tmpl/test.jade');
var template = jade.compile(data, 'utf-8');
console.log('pre-compile');
*/
app.use(router(app));
app.get('/', function * (next) {
    this.body = 'Hi there.';
});
app.get('/testAPI', function * (next) {
    var data = fs.readFileSync('testAPI.jade');
    var template = jade.compile(data, 'utf-8');
    this.body = template({});
});

app.get('/get/:id', function * (next) {
    //var user = yield User.findOne(this.params.id);

    // $("database.collection").find({"id":this.params.id}, function(r) {
    //     console.log('from db',r);
    //     this.body = r;
    // });
    var idA = this.params.id;
    //var findB = $("database.collection").find;
    //findB = $("database.collection").find;
    //console.log('id',id,findB);
    var a = yield $.find({
        "id": idA
    });
    this.body = a;

});
app.post('/post/:id', function * (next) {
    //var user = yield User.findOne(this.params.id);
    console.log(this.params);
    var id = this.params.id;
    $("database.collection").find({
        "id": id
    }, function(r) {
        console.log('find db', r, r.numberReturned);
        if (r.numberReturned != 0) {
            $("database.collection").update({
                "id": id
            }, {
                progress: '50%'
            }, function(r) {
                console.log('updated');
            });
        }

        //this.body = r;
    });
    $("database.collection").save({
        id: this.params.id
    });
    console.log('trying to save to database');
    this.body = 'received ', this.params.id;
});


/*
function * (next) {

 var json = yield {
  'baidu':request('http://www.baidu.com'),
  'hogan':readFile('test.hogan')
 }
 var html = template({
  //data: JSON.parse(json);
  data: {}
 });

 this.body = html + json.hogan+json.baidu.body;

}
*/
app.listen(8000);
console.log('running 8000');
