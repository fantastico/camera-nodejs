/**
 * Created by Ken on 2014/11/28.
 */
var io = require('socket.io-client');

var connect_init = {
    'camera_id' : '123456789abc',
    'request_key' : 'yyy'
}

var connect_params = {
    'port' : '123456789abc',
    'protocol' : 'rtsp',
    'ip' : 'rtsp',
    'filename' : 'filename'
}

var socket = io.connect("http://localhost:3001/camera");

socket.on('connect', function () {
    socket.emit('connect_init', connect_init);
});

socket.on('disconnect', function (data) {
    console.log('receive: ' + data  );
    socket.close();
});

socket.on('connect_init_success', function (data) {
    console.log('receive: ' + data  );
});

socket.on('connect_request', function(data) {
    connect_params.socketId = data.socketId;
    socket.emit('connect_params', connect_params);
});
