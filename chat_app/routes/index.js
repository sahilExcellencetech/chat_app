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
        collection: 'users'
    });
    var users = conn.model('users', schem);

    var name1, status1, image1, time, email3, id;
    socket.on('online', function(data) {
        var arr = [];
        users.update({
            email: data.email2
        }, {
            $set: {
                status: data.status,
                socket_id: data.socket_id
            }
        }, function(err) {
            if (!err) {
                users.find({}, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    for (var i = 0; i < result.length; i++) {
                        var row = result[i];
                        name1 = row.get('name');
                        status1 = row.get('status');
                        image1 = row.get('image');
                        time = row.get('time');
                        email3 = row.get('email');
                        id = row.get('_id');
                        arr.push({name: name1, status: status1, image: image1, time: 'Last Seen:' + time, email3: email3, id: id});
                    }
                    io.sockets.emit('result', {
                        arr: arr
                    });
                });
            }
        });
    });
    socket.on('offline', function(data) {
        var arr1 = [];
        var moment = require('moment-timezone');
        var cur_time = moment.tz("Asia/Kolkata").format('h:mm a');
        users.update({
            email: data.email
        }, {
            $set: {
                status: data.status,
                time: cur_time
            }
        }, function(err) {
            if (!err) {
                users.find({}, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    for (var i = 0; i < result.length; i++) {
                        var row = result[i];
                        name1 = row.get('name');
                        status1 = row.get('status');
                        image1 = row.get('image');
                        time = row.get('time');
                        email3 = row.get('email');
                        id = row.get('_id');
                        arr1.push({name: name1, status: status1, image: image1, time: 'Last Seen:' + time, email3: email3, id: id});
                    }
                    io.sockets.emit('result', {
                        arr: arr1
                    });
                });
            }
        });
    });

    socket.on('disconnect', function() {
        var arr2 = [];
        var sessionid = socket.id;
        users.findOne({socket_id: sessionid}, function(err, result) {
            if (err) {
                console.log(err);
            }
            var moment = require('moment-timezone');
            var cur_time = moment.tz("Asia/Kolkata").format('h:mm a');
            users.update({
                socket_id: sessionid
            }, {
                $set: {
                    status: 'Offline',
                    time: cur_time
                }
            }, function(err) {
                if (!err) {
                    users.find({}, function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        for (var i = 0; i < result.length; i++) {
                            var row = result[i];
                            name1 = row.get('name');
                            status1 = row.get('status');
                            image1 = row.get('image');
                            time = row.get('time');
                            email3 = row.get('email');
                            id = row.get('_id');
                            arr2.push({name: name1, status: status1, image: image1, time: 'Last Seen:' + time, email3: email3, id: id});
                        }
                        io.sockets.emit('result', {
                            arr: arr2
                        });
                    });
                }
            });
        });

    });

    socket.on('discon', function(data) {
        var arr3 = [];
        var moment = require('moment-timezone');
        var cur_time = moment.tz("Asia/Kolkata").format('h:mm a');
        users.update({
            email: data.email5
        }, {
            $set: {
                status: 'Offline',
                time: cur_time
            }
        }, function(err) {
            if (!err) {
                users.find({}, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    for (var i = 0; i < result.length; i++) {
                        var row = result[i];
                        name1 = row.get('name');
                        status1 = row.get('status');
                        image1 = row.get('image');
                        time = row.get('time');
                        email3 = row.get('email');
                        id = row.get('_id');
                        arr3.push({name: name1, status: status1, image: image1, time: 'Last Seen:' + time, email3: email3, id: id});
                    }
                    io.sockets.emit('result', {
                        arr: arr3
                    });
                });
            }
        });
    });
    var new_room;
    socket.on('chat_init', function(data) {
        new_room = Date.now();
        socket.join(new_room);
        socket.emit('self', {
            new_room: new_room
        });
//        socket.join('room1');
        console.log("new_room");
        console.log(new_room);
        users.find({email: data.email3}, function(err, result) {
            if (err) {
                console.log(err);
            }
            var sckt = result[0].get('socket_id');
            io.to(sckt).emit('chat_init1', {
                new_room: new_room
            });
        });
    });

    socket.on('chat_init1_reply', function(data) {
        console.log("new_room1");
        console.log(data.new_room1);
        socket.join(data.new_room1);
//        socket.join('room1');
    });

    socket.on('msg', function(data) {
        console.log("new_room2");
        console.log(data.room);
        socket.broadcast.to(data.room).emit('msg_reply', {
            msg_reply: data.msg
        });
//        socket.broadcast.to('room1').emit('msg_reply', {
//            msg_reply: data.msg
//        });
    });

//    socket.on('msg', function(data) {
//        io.to(data.socket_id1).emit('msg_reply', {
//            msg_reply: data.msg
//        });
//    });


});

router.all('/register', function(req, res) {
    var users = req.Collection;
    var name = req.body.name;
    var email = req.body.email;
    var pwd = req.body.pwd;
    var status = "Offline";
    var image = "images/user.jpg";
    if (name && email && pwd) {
        users.find({email: email}, function(err, result) {
            if (err) {
                console.log(err);
                res.json({err: 'Unknown error', err2: err});
            }
            if (!result.length) {
                var crypto = require('crypto');
                var md5Hash = crypto.createHash('md5');
                md5Hash.update(pwd);
                var hash = md5Hash.digest('hex');
                var post = new users({
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
    var users = req.Collection;
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
        users.find({email: email1}, function(err, result) {
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
    var users = req.Collection;
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

        users.find({email: fbemail}, function(err, result) {
            if (err) {
                console.log(err);
                res.json({err: 'Unknown error', err2: err});
            }
            if (!result.length) {
                var post = new users({
                    fb_id: fbid,
                    name: fbname,
                    email: fbemail,
                    password: hash,
                    status: '',
                    image: 'https://graph.facebook.com/' + fbid + '/picture'
                });
                post.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.json({err: 'Unknown error', err2: err});
                    }
                });
            }
            res.json({val: 1, email3: fbemail});
        });
    }
    else {
        res.json({err: 'Unknown error'});
    }

});

router.all('/messages', function(req, res) {
    var mongoose = require('mongoose');
    var users = req.Collection;
    var id = req.body.id1;
    var name1, status1, image1, time, email3, socket_id1;
    if (id) {
        users.find({'_id': mongoose.Types.ObjectId(id)}, function(err, result) {
            if (err) {
                console.log(err);
                res.json({err: 'Unknown error', err2: err});
            }
            var row = result[0];
            name1 = row.get('name');
            status1 = row.get('status');
            image1 = row.get('image');
            email3 = row.get('email');
            time = row.get('time');
            socket_id1 = row.get('socket_id');
            res.json({name: name1, status: status1, image: image1, email3: email3, time: 'Last Seen:' + time, socket_id1: socket_id1});
        });
    }
    else {
        res.json();
    }
});

router.all('/msgstore', function(req, res) {
    var users = req.Collection;
    var array = req.body.array1;
    res.json();
});

module.exports = router;