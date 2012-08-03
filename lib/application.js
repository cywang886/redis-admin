var express = require('express'),
    redis = require('redis'),
    config = require('../config'),
    app = express(),
    client = redis.createClient(config.SERVER_PORT, config.SERVER_IP);

app.configure(function() {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
});

// Keys
app.get('/keys', function(req, res, next) {
    client.multi()
        .keys("*", function (err, replies) {
            client.mget(replies, function(err, redisdata) {
                if (err) {
                    return next(err);
                }
                var params = {};

                replies.forEach(function(value, index) {
                    params[value] = redisdata[index];
                });

                jsonSend(res, params);
            });
        })
        .exec();
});

// Get key value
app.get('/get/:key', function(req, res, next) {
    var params = req.params,
        key = params.key,
        data = {};

    client.get(key, function (err, reply) {
        if (err) {
            return next(err);
        }
        data[key] = reply || null;

        jsonSend(res, data);
    });
});

// Set key
app.post('/set/:key', function(req, res, next) {
    var key = req.params.key,
        value = req.body.value,
        data = {};

    client.set(key, value, function(err) {
        if (err) {
            return next(err);
        }
        data[key] = value;
        
        jsonSend(res, data);
    });
});

function jsonSend(res, data) {
    res.contentType('application/json');
    res.send(JSON.stringify(data));
};

app.listen(3000);
