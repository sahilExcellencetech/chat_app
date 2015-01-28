module.exports = function() {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/chat_app');

    var conn = mongoose.connection;

    var model_schema = mongoose.Schema({}, {
        strict: false,
        collection: 'table1'
    });
    var CollectionModel = conn.model('table1', model_schema);

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
