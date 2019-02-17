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
require('dotenv').config();
const config_1 = __importDefault(require("../config"));
const pino_1 = __importDefault(require("pino"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const routesService_1 = __importDefault(require("./services/routesService"));
const dbService_1 = __importDefault(require("./services/dbService"));
const app = express_1.default();
app.use(cors_1.default());
const server = http_1.default.createServer(app);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield dbService_1.default.initializeDb();
        const collections = yield dbService_1.default.createCollections(db);
        const candidatesCollection = collections.candidatesCollection;
        const votersCollection = collections.votersCollection;
        const votesCollection = collections.votesCollection;
        /*
         * Listen to the new events
        */
        /*
         * Start the API
         */
        routesService_1.default(votesCollection, candidatesCollection, votersCollection, app);
        /**
         * Start Express server.
         */
        server.listen(config_1.default.port, () => {
            pino_1.default().info('The server is running at http://localhost:%d in %s mode', config_1.default.port);
            pino_1.default().info('Press CTRL-C to stop');
        });
    });
}
exports.start = start;
function stop() {
    return __awaiter(this, void 0, void 0, function* () {
        server.close();
    });
}
exports.stop = stop;
start();
//# sourceMappingURL=server.js.map