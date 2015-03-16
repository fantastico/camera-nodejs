/**
 * Created by Ken on 2014/11/21.
 */
var app = require('express')();
var httpserver = require('http').createServer(app);
var Server = require('socket.io');
var db = require('../database/db_operator');

var io = new Server(httpserver);
var camera_list = {};

var test;
io.of('/camera').on('connection', function (socket) {
    test = socket;
    socket.on('connect_init',function (data) {
        if(typeof(data['apk_id']) == "undefined" || typeof(data['camera_key']) == "undefined"){
            socket.disconnect('unauthorized');
            return;
        }
        db.checkCameraKey(data, function(valid){
            if(!valid){
                socket.disconnect('unauthorized');
                return;
            }
            camera_list[data['apk_id']] = socket.id;
            socket.on('disconnect', function(){
                delete camera_list[data['apk_id']];
            });
            socket.join(socket.id);
            socket.emit('connect_init_success', 'connect_init_success');

        });

        console.log('receive: ' + data['apk_id']  );
    });

    socket.on('connect_params',function (data) {
        io.of('/user').to(data.socketId).emit('connect_params', data);
    });
});

io.of('/user').on('connection', function (socket) {
    socket.on('connect_request',function (data) {
        if(typeof(data['apk_id']) == "undefined" || typeof(data['user_key']) == "undefined"){
            socket.disconnect('unauthorized');
            return;
        }
        db.checkUserKey(data, function(valid, result){
            if(!valid){
                socket.disconnect('unauthorized');
                return;
            }

            var socketId = camera_list[data['apk_id']];
            if(socketId == null){
                socket.disconnect('unauthorized');
                return;
            }

            io.of('/camera').to(socketId).emit('connect_request', {'socketId' : socket.id});
        });

        console.log('receive: ' + data['apk_id']  );
    });
});

io.listen(3000);