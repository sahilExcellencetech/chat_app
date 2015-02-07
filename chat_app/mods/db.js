module.exports = function() {
    var mongoose = require('mongoose')
            , Schema = mongoose.Schema;
    mongoose.connect('mongodb://127.0.0.1/chat_app');

    var conn = mongoose.connection;

    var user_schema = mongoose.Schema({
        name: String,
        email: {type: String, match: /@/, required: true, trim: true},
        password: String,
        status: String,
        image: String,
        time: String,
        socket_id: String
    });
    var User = conn.model('users', user_schema);

    var user_chat_schema = mongoose.Schema({
        msg: String,
        msg_time: Number,
        sender_user_id: {type: Schema.Types.ObjectId, ref: 'users'},
        receiver_user_id: {type: Schema.Types.ObjectId, ref: 'users'},
        sent: Boolean
    });
    var User_Chat = conn.model('user_Chat', user_chat_schema);

    conn.on('error', function(err) {
        console.log(err);
        process.exit();
    });
    return function(req, res, next) {
        req.mongo = conn;
        req.Collection = User;
        req.Collection1 = User_Chat;
        next();
    };

};
