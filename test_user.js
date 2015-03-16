/**
 * Created by Ken on 2014/11/24.
 */
var io = require('socket.io-client');

var connect_request = {
    'camera_id' : 'xxx',
    'user_key' : '4L5UPcilAFcodrAI0001426510813117'
}

var socket = io.connect("http://localhost:3001/user");

socket.on('connect', function () {
    socket.emit('connect_request', connect_request);
});

socket.on('disconnect', function (data) {
    console.log('receive: ' + data  );
    socket.close();
});

socket.on('connect_params', function (data) {
    console.log('receive: ' + data  );
});
