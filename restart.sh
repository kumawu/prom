#!/bin/bash
#works on linux system

BASEDIR=$(dirname $0)
PID=$BASEDIR/.pid

if [ -f $PID ]
then
	cat $PID
	echo ' killed '
    cat $PID | xargs kill
else
    pkill -f weibo-ria-server
fi
# 启动服务器; 服务器日志默认定向到server目录下log.txt
#nohup node ${BASEDIR}/httpd.js  > ${BASEDIR}/log.txt 2>&1 &
node ${BASEDIR}/httpd.js  > ${BASEDIR}/log.txt 2>&1 &
echo 'waiting...'
sleep 5
cat ${BASEDIR}/log.txt

exit 0
