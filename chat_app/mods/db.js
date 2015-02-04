module.exports = function() {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/chat_app');

    var conn = mongoose.connection;

    var model_schema = mongoose.Schema({
        name: String,
        email: {type: String, match: /@/, required: true, trim: true},
        password: String,
        status: String,
        image: String,
        time: String,
        socket_id: String
    });
    var CollectionModel = conn.model('users', model_schema);

    conn.on('error', function(err) {
        console.log(err);
        process.exit();
    });
    return function(req, res, next) {
        req.mongo = conn;
        req.Collection = CollectionModel;
        next();
    };

};
