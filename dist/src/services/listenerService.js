"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const amqp = require('amqplib/callback_api');
const config_1 = __importDefault(require("../../config"));
function default_1(votesCollection, candidatesCollection, votersCollection) {
    /*
     * Start to listen for the events
     */
    amqp.connect(config_1.default.rabbit.uri, (error, connection) => {
        if (error)
            return console.error(error);
        connection.createChannel((error, channel) => {
            channel.assertQueue(config_1.default.rabbit.name, { durable: false });
            pino_1.default().info(' [*] Waiting for messages in %s. To exit press CTRL+C', config_1.default.rabbit.name);
            channel.consume(config_1.default.rabbit.name, (stringifiedMsg) => {
                pino_1.default().info(' [x] Received: %s', stringifiedMsg.content);
                const msg = JSON.parse(stringifiedMsg.content);
                switch (msg.eventType) {
                    case 'CandidateAdded':
                        candidatesCollection
                            .findOne({ event: msg.eventValue })
                            .then((doc) => {
                            if (doc === null) {
                                candidatesCollection.insertOne({
                                    event: msg.eventValue
                                });
                            }
                        });
                        break;
                    case 'VoterAdded':
                        votersCollection
                            .findOne({ event: msg.eventValue })
                            .then((voter) => {
                            if (voter === null) {
                                votersCollection.insertOne({
                                    event: msg.eventValue
                                });
                            }
                        });
                        break;
                    case 'NewVote':
                        votesCollection
                            .findOne({ event: msg.eventValue })
                            .then((vote) => {
                            if (vote === null) {
                                votesCollection.findOne({
                                    event: msg.eventValue
                                });
                            }
                        });
                        break;
                    case 'VotesBought':
                        break;
                }
            }, { noAck: true });
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=listenerService.js.map