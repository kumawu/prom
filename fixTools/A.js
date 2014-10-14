 (function() {
     var $ = require("mongous").Mongous;

     $("database.collection").find({
             $or: [{
                 "title": {
                     $exists: true
                 }
             }, {
                 "state": {
                     $exists: true
                 }
             }]
         },
         function(r) {
             r.documents.forEach(function(v, i) {
                 if (v.user) {
                     console.log('found mistake', v);
                     delete v.user;
                     $("database.collection").update({
                         id: v.id
                     }, v);
                 }
             });
         });
 })();