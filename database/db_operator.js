/**
 * Created by ken on 2014/10/26.
 */
var mysql = require('mysql');
var config = require('./config');
var util = require('./util');

var pool = mysql.createPool(config);

function register(params, callback) {

    pool.getConnection(function (err, conn) {
        conn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }

                var values = [params.apk_id, util.gen_key(), util.gen_key(), params.ip, params.max_users,
                    util.gen_key(), util.gen_key(), params.ip, params.max_users];

                var sql = "INSERT INTO camera (apk_id, user_key, camera_key, ip, max_users) " +
                    "VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_key = ?, camera_key = ?, ip = ?, max_users = ?";

                conn.query(sql, values, function (err, result) {
                    if (err) {
                        conn.rollback(function () {
                            throw err;
                        });
                    }
                    conn.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        console.log('success!');
                        var json_values = {
                            apk_id: values[0],
                            user_key: values[1],
                            camera_key: values[2],
                            ip: values[3],
                            max_users: values[4]
                        };
                        callback(err, result, json_values);
                    });
                });
            }
        );
    });
}

function checkCameraKey(params, callback) {
    pool.getConnection(function (err, conn) {
        var values = [params.apk_id]
        var sql = "SELECT camera_key FROM camera where apk_id = ?";
        conn.query(sql, values, function (err, result) {
            if(result == null || result.length < 1 || params.camera_key != result[0].camera_key){
                callback(false);
                return;
            }
            callback(true);
        });
    });
}

function checkUserKey(params, callback) {
    pool.getConnection(function (err, conn) {
        var values = [params.apk_id]
        var sql = "SELECT user_key, camera_key FROM camera where apk_id = ?";
        conn.query(sql, values, function (err, result) {
            if(result == null || result.length < 1 || params.user_key != result[0].user_key){
                callback(false);
                return;
            }
            callback(true, result[0]);
        });
    });
}


module.exports.register = register;
module.exports.checkCameraKey = checkCameraKey;
module.exports.checkUserKey = checkUserKey;
