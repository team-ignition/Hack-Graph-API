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
    let document = yield collection.findOne({ [`event.returnValues.${params[0]}`]: params[1].toString() }, { [`event.returnValues.${valueName}`]: 1 });
    if (document === null) {
        document = { event: { returnValues: { [valueName]: undefined } } };
    }
    return document.event.returnValues[valueName];
});
const getResolver = (candidatesCollection) => __awaiter(this, void 0, void 0, function* () {
    const candidates = (obj, args) => __awaiter(this, void 0, void 0, function* () {
        const filteredArgs = lodash_1.default.pickBy(args, lodash_1.default.negate(lodash_1.default.isUndefined));
        const params = Object.entries(filteredArgs)[0];
        const document = yield candidatesCollection.aggregate([
            {
                $lookup: {
                    from: 'votes',
                    let: { localAddress: '$event.returnValues._whiteListedAccount' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: [`$event.returnValues.${params[0]}`, params[1]] },
                                        { $eq: ['$event.returnValues._candidateAddress', '$$localAddress'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'event.returnValues.candidate_votes'
                }
            },
            {
                $project: {
                    _id: '$_id',
                    'event.returnValues._candidateAddress': '$event.returnValues._whiteListedAccount',
                    'event.returnValues.candidate_votes': 1,
                    'event.returnValues._totalAmountOfVotes': {
                        $cond: {
                            if: { $gt: [{ $size: '$event.returnValues.candidate_votes' }, 0] },
                            then: { $sum: '$event.returnValues.candidate_votes.event.returnValues._amount' },
                            else: 0
                        }
                    }
                }
            },
            { $sort: { 'event.returnValues._totalAmountOfVotes': -1 } }
        ]);
        const candidatesByPeriod = yield document.toArray();
        const pageInfo = yield applyPagination(document, args.first, args.last);
        return candidatesByPeriod.map((key) => key.event.returnValues);
    });
    const resolvers = {
        Candidate: {
            _candidateAddress: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args._candidateAddress)
                    return args._candidateAddress;
                return resolve(args, '_whiteListedAccount', candidatesCollection);
            }),
            _totalAmountOfVotes: (args) => __awaiter(this, void 0, void 0, function* () {
                if (lodash_1.default.isInteger(args._totalAmountOfVotes))
                    return args._totalAmountOfVotes;
                return resolve(args, '_totalAmountOfVotes', candidatesCollection);
            })
        },
        Query: {
            candidate(obj, { _candidatesAddress, _totalAmountOfVotes, _periodIndex, _votes }) {
                return {
                    _candidatesAddress,
                    _totalAmountOfVotes,
                    _periodIndex,
                    _votes
                };
            },
            candidates
        }
    };
    return resolvers;
});
exports.default = getResolver;
//# sourceMappingURL=candidates.js.map