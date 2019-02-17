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
const lodash_1 = __importDefault(require("lodash"));
function applyPagination(query, first, last) {
    return __awaiter(this, void 0, void 0, function* () {
        let count;
        if (first || last) {
            count = yield query.clone().count();
            let limit;
            let skip;
            if (first && count > first) {
                limit = first;
            }
            if (last) {
                if (limit && limit > last) {
                    skip = limit - last;
                    limit = limit - skip;
                }
                else if (!limit && count > last) {
                    skip = count - last;
                }
            }
            if (skip) {
                query.skip(skip);
            }
            if (limit) {
                query.limit(limit);
            }
        }
        return {
            hasNextPage: Boolean(first && count > first),
            hasPreviousPage: Boolean(last && count > last)
        };
    });
}
const resolve = (args, valueName, collection) => __awaiter(this, void 0, void 0, function* () {
    const filteredArgs = lodash_1.default.pickBy(args, lodash_1.default.negate(lodash_1.default.isUndefined));
    const params = Object.entries(filteredArgs)[0];
    const document = yield collection.findOne({ [`event.returnValues.${params[0]}`]: params[1] }, { [`event.returnValues.${valueName}`]: 1 });
    return document.event.returnValues[valueName];
});
const getResolver = (votesCollection) => __awaiter(this, void 0, void 0, function* () {
    const votes = (obj, args) => __awaiter(this, void 0, void 0, function* () {
        const filteredArgs = lodash_1.default.pickBy(args, lodash_1.default.negate(lodash_1.default.isUndefined));
        const params = Object.entries(filteredArgs)[0];
        const document = yield votesCollection.find({ [`event.returnValues.${params[0]}`]: params[1] }, { [`event.returnValues`]: 1 });
        const array = yield document.toArray();
        const pageInfo = yield applyPagination(document, args.first, args.last);
        return array.map((key) => key.event.returnValues);
    });
    const totalAmountOfVotes = (obj, args) => __awaiter(this, void 0, void 0, function* () {
        const filteredArgs = lodash_1.default.pickBy(args, lodash_1.default.negate(lodash_1.default.isUndefined));
        const params = Object.entries(filteredArgs)[0];
        const document = yield votesCollection.aggregate([
            {
                $match: {
                    [`event.returnValues.${params[0]}`]: params[1]
                }
            },
            {
                $project: {
                    _id: '$_id',
                    'event.returnValues._amount': {
                        $sum: '$event.returnValues._amount'
                    },
                    'event.returnValues._periodIndex': {
                        $sum: params[1]
                    }
                }
            }
        ]);
        const array = yield document.toArray();
        return array.map((key) => key.event.returnValues);
    });
    const resolvers = {
        Vote: {
            _candidateAddress: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._candidateAddress)
                    return args._candidateAddress;
                return resolve(args, '_candidateAddress', votesCollection);
            }),
            _voterAddress: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._voterAddress)
                    return args._voterAddress;
                return resolve(args, '_voterAddress', votesCollection);
            }),
            _amount: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._amount)
                    return args._amount;
                return resolve(args, '_amount', votesCollection);
            }),
            _periodIndex: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._periodIndex)
                    return args._periodIndex;
                return resolve(args, '_periodIndex', votesCollection);
            })
        },
        TotalAmountOfVotes: {
            _periodIndex: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args[0]._periodIndex)
                    return args[0]._periodIndex;
            }),
            _amount: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args[0]._amount)
                    return args[0]._amount;
            })
        },
        Query: {
            vote(obj, { _candidatesAddress, _voterAddress, _amount, _periodIndex }) {
                return {
                    _candidatesAddress,
                    _voterAddress,
                    _amount,
                    _periodIndex
                };
            },
            votes,
            totalAmountOfVotes
        }
    };
    return resolvers;
});
exports.default = getResolver;
//# sourceMappingURL=votes.js.map