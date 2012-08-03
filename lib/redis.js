var redis = require('redis'),
    config = require('../config');

client = redis.createClient(config.SERVER_PORT, config.SERVER_IP);
