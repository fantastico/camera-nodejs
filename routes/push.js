/**
 * Created by Ken on 2014/11/21.
 */
var app = require('express')();
var httpserver = require('http').createServer(app);
var Server = require('socket.io');
var db = require('../database/db_operator');
var debug = require('debug')('camera_manager');

var io = new Server(httpserver);
var camera_list = {};

io.of('/camera').on('connection', function (socket) {
    socket.on('connect_init',function (data) {
        if(typeof(data['camera_id']) == "undefined" || typeof(data['request_key']) == "undefined"){
            socket.disconnect('unauthorized');
            return;
        }
        db.checkCameraKey(data, function(valid){
            if(!valid){
                socket.disconnect('unauthorized');
                return;
            }
            camera_list[data['camera_id']] = socket.id;
            socket.on('disconnect', function(){
                delete camera_list[data['camera_id']];
            });
            socket.join(socket.id);
            socket.emit('connect_init_success', 'connect_init_success');
        });

        debug('receive: ' + data['camera_id'] );
    });

    socket.on('connect_params',function (data) {
        io.of('/user').to(data.socketId).emit('connect_params', data);
    });
});

io.of('/user').on('connection', function (socket) {
    socket.on('connect_request',function (data) {
        if(typeof(data['camera_id']) == "undefined" || typeof(data['user_key']) == "undefined"){
            socket.disconnect('unauthorized');
            return;
        }
        db.checkUserKey(data, function(valid, result){
            if(!valid){
                socket.disconnect('unauthorized');
                return;
            }

            var socketId = camera_list[data['camera_id']];
            if(socketId == null){
                socket.disconnect('unauthorized');
                return;
            }

            io.of('/camera').to(socketId).emit('connect_request', {'socketId' : socket.id, 'user_key':data['user_key']});
        });

        debug('receive: ' + data['camera_id']  );
    });
});

io.listen(3001);