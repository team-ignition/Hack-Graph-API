"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const resolve = (args, valueName, collection) => __awaiter(this, void 0, void 0, function* () {
    const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));
    const params = Object.entries(filteredArgs)[0];
    const document = yield collection.findOne({ [`event.${params[0]}`]: params[1] }, { [`event.${valueName}`]: 1 });
    return document.event[valueName];
});
const getResolver = (candidatesCollection) => __awaiter(this, void 0, void 0, function* () {
    const resolvers = {
        Event: {
            address: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'address', candidatesCollection);
                return result;
            }),
            blockHash: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'blockHash', candidatesCollection);
                return result;
            }),
            blockNumber: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'blockNumber', candidatesCollection);
                return result;
            }),
            logIndex: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'logIndex', candidatesCollection);
                return result;
            }),
            removed: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'removed', candidatesCollection);
                return result;
            }),
            transactionHash: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'transactionHash', candidatesCollection);
                return result;
            }),
            transactionIndex: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'transactionIndex', candidatesCollection);
                return result;
            }),
            id: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'id', candidatesCollection);
                return result;
            }),
            event: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'event', candidatesCollection);
                return result;
            }),
            signature: (args) => __awaiter(this, void 0, void 0, function* () {
                const result = yield resolve(args, 'signature', candidatesCollection);
                return result;
            })
        },
        Query: {
            event(obj, { address, blockHash, blockNumber, logIndex, removed, transactionHash, transactionIndex, id, event, signature }) {
                return {
                    address,
                    blockHash,
                    blockNumber,
                    logIndex,
                    removed,
                    transactionHash,
                    transactionIndex,
                    id,
                    event,
                    signature
                };
            }
        }
    };
    return resolvers;
});
exports.default = getResolver;
//# sourceMappingURL=ownedRegistryContract.js.map