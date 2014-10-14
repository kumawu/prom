//Gruntfile.js
var http = require("http")
  , path = require("path")
  , walker = require("./lib/dirWalker");
module.exports = function(grunt){

  //Load Plugin(s)
  require('load-grunt-tasks')(grunt);

  //Project Configuration
  grunt.initConfig({
    jade: {
      compile: {
        files: (function(){
          var data = walker("views/", "",function(uri, files){
              var _data = {};
              var inputdir = 'views/';
              var outdir = 'temp/';
              if(path.extname(uri) == '.jade'){
                uri = uri.replace(/^.*views\/(.*)\.jade$/,"$1")
                  if(!files.jadejson){
                    files["jadejson"] = {};
                  }
                  files.jadejson[outdir+uri+'.html'] = [inputdir+uri+'.jade']
              }
              return files;
          });
          return data.jadejson;
        })(),
        options: {
          data: function(dest, src){
            return require('./data/index.json');
          }
        }
      }
    },
    shell: {
        stopDev: {                      // Target
            options: {                      // Options
                stderr: false
            },
            command: 'sh ./init.d/bootDev.sh stop'
        },                              // Task
        startDev: {                      // Target
            options: {                      // Options
                stderr: false
            },
            command: 'sh ./init.d/bootDev.sh start'
        },
        stopProd: {                      // Target
            options: {                      // Options
                stderr: false
            },
            command: 'sh ./init.d/bootProd.sh stop'
        },                              // Task
        startProd: {                      // Target
            options: {                      // Options
                stderr: false
            },
            command: 'sh ./init.d/bootProd.sh start'
        }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: ['lib/index.js']
      }
    },
    watch: {
      options: {
        dateFormat: function(time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
          grunt.log.writeln('Waiting for more changes...');
        }
      },
      express: {
        files: ['**/*.jade'], //Files to be watched
        options: { //Server options
          spawn: true, //Must have for reload
          livereload: true //Enable LiveReload
        },
        tasks:'jshint:all'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jade');

  //Register Task

  //生产环境没有
  grunt.registerTask('default',['jshint:all','jade','shell:startProd']);

  //开发环境配置liveReload
  grunt.registerTask('dev',['jshint:all','jade','shell:startDev','watch']);

  grunt.event.on('watch', function(action, filepath) {
    http.get("http://w.weibo.com/onfilechanged?filepath="+filepath, function(res) {
      console.log("Got response: " + res.statusCode);
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  });
};