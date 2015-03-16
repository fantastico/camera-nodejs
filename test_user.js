/**
 * Created by Ken on 2014/11/24.
 */
var io = require('socket.io-client');

var connect_request = {
    'apk_id' : '123456789abc',
    'user_key' : 'xxx'
}

var socket = io.connect("http://localhost:3000/user");

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
