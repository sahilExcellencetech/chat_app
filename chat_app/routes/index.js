var express = require('express');
var router = express.Router();

var app = express();
port = 8080;
io = require('socket.io');
http = require('http');
server = http.createServer(app);
io = io.listen(server);
server.listen(port);

io.on('connection', function(socket) {
    var mongoose = require('mongoose');
    var conn = mongoose.createConnection('mongodb://127.0.0.1/chat_app');
    var schem = mongoose.Schema({}, {
        strict: false,
        collection: 'table1'
    });
    var table1 = conn.model('table1', schem);

    var name1, status1, image1, time;
    var arr = [];
    table1.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.json({err: 'Unknown error', err2: err});
        }
        for (var i = 0; i < result.length; i++) {
            var row = result[i];
            name1 = row.get('name');
            status1 = row.get('status');
            image1 = row.get('image');
            arr.push({name: name1, status: status1, image: image1});
        }

        socket.emit('news', {
            arr: arr
        });
        socket.on('online', function(data) {
            var moment = require('moment-timezone');
            var cur_time = moment.tz("Asia/Kolkata").format('h:mm a');
            table1.update({
                email: data.email2
            }, {
                $set: {
                    status: data.status,
                    time: cur_time
                }
            }, function(err) {
                if (!err) {
                    table1.find({}, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.json({err: 'Unknown error', err2: err});
                        }
                        for (var i = 0; i < result.length; i++) {
                            var row = result[i];
                            name1 = row.get('name');
                            status1 = row.get('status');
                            image1 = row.get('image');
                            time = row.get('time');
                            arr.push({name: name1, status: status1, image: image1, time: time});
                        }
//                        socket.emit('news', {
//                            arr: arr
//                        });
                    });
                }
            });


        });

    });
});

router.all('/register', function(req, res) {
    var table1 = req.Collection;
    var name = req.body.name;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var status = "Offline";
    var image = "images/user.jpg";
    if (name && email && pwd) {
        table1.find({email: email}, function(err, result) {
            if (err) {
                console.log(err);
                res.json({err: 'Unknown error', err2: err});
            }
            if (!result.length) {
                var crypto = require('crypto');
                var md5Hash = crypto.createHash('md5');
                md5Hash.update(pwd);
                var hash = md5Hash.digest('hex');
                var post = new table1({
                    name: name,
                    email: email,
                    password: hash,
                    status: status,
                    image: image
                });
                post.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.json({err: 'Unknown error', err2: err});
                    }
                });
            }
            else {
                var warning = "E-mail already exists";
            }
            res.json({warning: warning});
        });
    }
    else {
        res.json({required: 'All fields are required'});
    }

});


router.all('/login', function(req, res) {
    var table1 = req.Collection;
    var email1 = req.body.email1;
    var pwd1 = req.body.pwd1;
    var temp, pass;
    var frgt = req.body.frgt;
    if (frgt) {
        var generatePassword = require('password-generator');
        var random_pwd = generatePassword();
        res.json({random_pwd: random_pwd});
    }
    else if (email1) {
        table1.find({email: email1}, function(err, result) {
            if (err) {
                console.log(err);
                res.json({err: 'Unknown error', err2: err});
            }
            if (!result.length) {
                var info = "E-mail does not exists";
                res.json({info: info});
            }
            else {
                var crypto = require('crypto');
                var md5Hash = crypto.createHash('md5');
                md5Hash.update(pwd1);
                var hash1 = md5Hash.digest('hex');
                pass = result[0].get('password');
                if (hash1 == pass) {
                    res.json({val: 1, email2: email1});
//                    table1.find({}, function(err, result) {
//                        if (err) {
//                            console.log(err);
//                            res.json({err: 'Unknown error', err2: err});
//                        }
//                        for (var i = 0; i < result.length; i++) {
//                            var row = result[i];
//                            name1 = row.get('name');
//                            status1 = row.get('status');
//                            image1 = row.get('image');
//                            arr.push({name: name1, status: status1, image: image1});
//                        }
//                        res.json({arr: arr});
//                    });
                }
                else {
                    temp = "Incorrect E-mail/Password";
                    res.json({temp: temp});
                }
            }
        });
    }
    else {
        res.json({req: "Enter E-mail/Password"});
    }

});

router.all('/fblogin', function(req, res) {
    var table1 = req.Collection;
    var fbid = req.body.fbid;
    var fbname = req.body.fbname;
    var fbemail = req.body.fbemail;
    if (fbemail) {
        var generatePassword = require('password-generator');
        var random_pwd = generatePassword();
        var crypto = require('crypto');
        var md5Hash = crypto.createHash('md5');
        md5Hash.update(random_pwd);
        var hash = md5Hash.digest('hex');

        table1.find({email: fbemail}, function(err, result) {
            if (err) {
                console.log(err);
                res.json({err: 'Unknown error', err2: err});
            }
            if (!result.length) {
                var post = new table1({
                    fb_id: fbid,
                    name: fbname,
                    email: fbemail,
                    password: hash,
                    status: 'This is how we do',
                    image: 'https://graph.facebook.com/' + fbid + '/picture'
                });
                post.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.json({err: 'Unknown error', err2: err});
                    }
                });
            }
            res.json();
        });
    }
    else {
        res.json({err: 'Unknown error'});
    }

});

module.exports = router;