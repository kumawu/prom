var path 				= require('path');
var fs 					= require('fs');
var cluster 			= require('cluster');
var config 				= require('./config');
var server	= require('./index');

if(cluster.isMaster) {
	console.log('prom master server ' + process.pid);
	//默认启动3个http服务器监听同一端口
	var workerNum = config.workerNum || 3;
	var workers = [];
	
	//node 0.6版和0.8版cluster模块api有差异
	var isNewCluster = !!cluster.workers;
	
	for(var i = 0; i < workerNum; i++) {
		var worker = cluster.fork();
		workers.push(worker.process ? worker.process.pid : worker.pid);
	}
	
	var ExitEvent = isNewCluster ? 'exit' : 'death';
	//自动重启死亡worker子进程
	cluster.on(ExitEvent, function(worker) {
		workers.splice(workers.indexOf(worker.process ? worker.process.pid : worker.pid), 1);
		process.nextTick(function () {
			var worker = cluster.fork(); 
			workers.push(worker.process ? worker.process.pid : worker.pid);
		});
	});
	
	process.on('uncaughtException', function(err) {
		console.error('Caught exception: ', err);
	});
	
	var pidPath = path.join(__dirname,'.pid');
	fs.writeFile(pidPath, process.pid);
	
	//Master退出时杀死所有worker进程
	process.on('SIGTERM', function() {//SIGKILL是kill -9 的信号,无法捕获; SIGTERM是kill的信号,可以捕获
	  workers.forEach(function(pid) {
	    console.log('worker '+ pid + ' killed');
	    process.kill(pid);
	  });
	  
	  fs.unlink(pidPath,function(){
	  	console.log('Master killed');
	  	process.exit(0);
	  });
	});
	
	process.title = 'prom';//linux only
} else {
	server();
}