var express = require('express');
var db = require('../database/db_operator');
var router = express.Router();

/* GET home page. */
router.post('/register', function (req, res) {
    var apk_id = req.param('apk_id');
    var certificate_id = req.param('certificate_id');
    var max_users = req.param('max_users');
    if (typeof(max_users) == null) {
        max_users = 1;
    }

    if(typeof(apk_id) == "undefined" || typeof(certificate_id) == "undefined"){
        res.status(404).send('No apk_id or certificate_id');
    }

    if(!validate(apk_id, certificate_id)){
        res.status(403).send('Unauthorized');
    }

    db.register({apk_id:apk_id, ip: '127.0.0.1', max_users:max_users}, function (err, results, json_values) {
        if (err) {
            res.status(500).send('Insert database failed');
        }
        res.send(json_values);
    });
});

function validate(apk_id, certificate_id){
    return true;
}
module.exports = router;
