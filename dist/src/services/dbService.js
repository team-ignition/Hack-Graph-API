"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const bluebird_1 = __importDefault(require("bluebird"));
const config_1 = __importDefault(require("../../config"));
const dbService = {
    initializeDb() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mongo = bluebird_1.default.promisifyAll(mongodb_1.MongoClient);
                const client = yield mongo.connectAsync(config_1.default.db.uri);
                const db = client.db(config_1.default.db.name);
                return db;
            }
            catch (e) {
                return e;
            }
        });
    },
    createCollections(db) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidatesCollection = db.collection('candidates');
                const votersCollection = db.collection('voters');
                const votesCollection = db.collection('votes');
                return {
                    candidatesCollection,
                    votersCollection,
                    votesCollection
                };
            }
            catch (e) {
                return e;
            }
        });
    }
};
exports.default = dbService;
//# sourceMappingURL=dbService.js.map