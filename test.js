/**
 * Created by ken on 2014/10/27.
 */
var util = require('./database/util');


var length = 100;
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var pads = '0000000000000000';
function gen_key() {
    var text = new Date().getTime().toString();
    text = pads.substring(0, pads.length - text.length) + text;
    return text;
}

var str = util.gen_key();
console.log(' random string: ' + str);
console.log(' length: ' + str.length);
