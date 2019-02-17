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
const frontier_1 = __importDefault(require("../frontier"));
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
    let document = yield collection.findOne({ [`event.returnValues.${params[0]}`]: params[1].toString() }, { [`event.returnValues.${valueName}`]: 1 });
    if (document === null) {
        document = { event: { returnValues: { [valueName]: undefined } } };
    }
    return document.event.returnValues[valueName];
});
const getResolver = (votersCollection) => __awaiter(this, void 0, void 0, function* () {
    const voters = (obj, args) => __awaiter(this, void 0, void 0, function* () {
        const filteredArgs = lodash_1.default.pickBy(args, lodash_1.default.negate(lodash_1.default.isUndefined));
        const params = Object.entries(filteredArgs)[0];
        const document = yield votersCollection.aggregate([
            {
                $lookup: {
                    from: 'votes',
                    localField: 'event.returnValues._whiteListedAccount',
                    foreignField: 'event.returnValues._voterAddress',
                    as: 'event.returnValues.voters_votes'
                }
            },
            {
                $match: {
                    [`event.returnValues.voters_votes.event.returnValues.${params[0]}`]: params[1]
                }
            },
            {
                $project: {
                    _id: '$_id',
                    'event.returnValues._voterAddress': '$event.returnValues._whiteListedAccount',
                    'event.returnValues.voters_votes': 1,
                    'event.returnValues._tokensUsed': {
                        $sum: '$event.returnValues.voters_votes.event.returnValues._amount'
                    }
                }
            }
        ]);
        const votersByPeriod = yield document.toArray();
        const allVoters = yield votersCollection.find({}).toArray();
        allVoters.map((key) => {
            key.event.returnValues._periodIndex = params[1];
            votersByPeriod.map((a) => {
                if (key.event.returnValues._whiteListedAccount ===
                    a.event.returnValues._voterAddress) {
                    a.event.returnValues.voters_votes.map((i) => {
                        if (i.event.returnValues._periodIndex === params[1]) {
                            if (!key.event.returnValues._tokensUsed) {
                                key.event.returnValues._tokensUsed =
                                    i.event.returnValues._amount;
                            }
                            else {
                                key.event.returnValues._tokensUsed =
                                    key.event.returnValues._tokensUsed +
                                        i.event.returnValues._amount;
                            }
                        }
                    });
                }
                else {
                    key.event.returnValues._tokensUsed = '0';
                }
            });
        });
        const pageInfo = yield applyPagination(document, args.first, args.last);
        return allVoters.map((key) => key.event.returnValues);
    });
    const resolvers = {
        Voter: {
            _voterAddress: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._voterAddress)
                    return args._voterAddress;
                return resolve(args, '_whiteListedAccount', votersCollection);
            }),
            _tokensRemaining: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._tokensRemaining)
                    return args._tokensRemaining;
                return (frontier_1.default.contracts.TokenRankedList.votesBalance(args._periodIndex, args._whiteListedAccount));
            }),
            _tokensUsed: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._tokensUsed)
                    return args._tokensUsed;
                return resolve(args, '_tokensUsed', votersCollection);
            }),
            _tokensStaked: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._tokensStaked)
                    return args._tokensStaked;
                const tokensRemaining = yield frontier_1.default.contracts.TokenRankedList.votesBalance(args._periodIndex, args._whiteListedAccount);
                return args._tokensUsed + tokensRemaining;
            })
        },
        Query: {
            voter(obj, { _voterAddress, _tokensRemaining, _tokensStaked, _tokensUsed, _periodIndex }) {
                return {
                    _voterAddress,
                    _tokensRemaining,
                    _tokensStaked,
                    _tokensUsed,
                    _periodIndex
                };
            },
            voters
        }
    };
    return resolvers;
});
exports.default = getResolver;
//# sourceMappingURL=voters.js.map