/**
 * Created by ken on 2014/10/27.
 */

var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function rand_str(length) {
    var result = "";
    var interval = 10;
    var times = Math.ceil(length / interval);
    for (var k = 0; k < times; k++) {
        var rand = Math.random();
        if (k == times - 1) {
            interval = length - (interval * k);
        }
        for (var i = 0; i < interval; i++) {
            rand *= 10;
            rand -= Math.floor(rand);
            result += possible.charAt(Math.floor(rand * possible.length));
        }
    }
    return result;
}

var pads = '0000000000000000'
function gen_key(){
    var timestamp = new Date().getTime().toString();
    timestamp = pads.substring(0, pads.length - timestamp.length) + timestamp;
    return rand_str(16) + timestamp;

}
module.exports.gen_key = gen_key;