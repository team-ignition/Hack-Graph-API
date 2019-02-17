"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argv = require('yargs').argv;
exports.default = {
    name: 'trl-events-api',
    version: 'POC-v2',
    env: process.env.NODE_ENV || 'development',
    node_uri: process.env.NODE_URI || 'https://rinkeby.infura.io',
    port: process.env.PORT || 6500,
    strictRouting: true,
    db: {
        uri: process.env.DB_URI || 'mongodb://localhost:27017',
        name: process.env.DB_NAME || 'trl-cache-v2'
    },
    rabbit: {
        uri: process.env.RABBIT_URI || 'amqp://localhost',
        name: process.env.DB_NAME || 'trl'
    }
};
//# sourceMappingURL=config.js.map