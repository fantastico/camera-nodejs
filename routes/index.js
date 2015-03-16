var express = require('express');
var db = require('../database/db_operator');
var router = express.Router();

/* GET home page. */
router.post('/register', function (req, res) {
    var camera_id = req.param('camera_id');
    var max_users = req.param('max_users');
    if (typeof(max_users) == null) {
        max_users = 1;
    }

    if(typeof(camera_id) == "undefined"){
        res.status(404).send('No camera_id');
    }


    db.register({camera_id:camera_id, ip: '127.0.0.1', max_users:max_users}, function (err, results, json_values) {
        if (err) {
            res.status(500).send('Insert database failed');
        }
        res.send(json_values);
    });
});

module.exports = router;
