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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const typesDefs_1 = __importDefault(require("./schemas/typesDefs"));
const ownedRegistryContract_1 = __importDefault(require("./resolvers/ownedRegistryContract"));
const votes_1 = __importDefault(require("./resolvers/votes"));
const candidates_1 = __importDefault(require("./resolvers/candidates"));
const voters_1 = __importDefault(require("./resolvers/voters"));
const _ = __importStar(require("lodash"));
const createSchema = (candidatesCollection, votersCollection, votesCollection) => __awaiter(this, void 0, void 0, function* () {
    const ownedRegistryContractResolvers = yield ownedRegistryContract_1.default(candidatesCollection);
    const votesResolver = yield votes_1.default(votesCollection);
    const candidatesResolver = yield candidates_1.default(candidatesCollection);
    const votersResolver = yield voters_1.default(votersCollection);
    const resolvers = _.merge([
        ownedRegistryContractResolvers,
        votesResolver,
        candidatesResolver,
        votersResolver
    ]);
    return graphql_tools_1.makeExecutableSchema({ typeDefs: typesDefs_1.default, resolvers });
});
exports.default = createSchema;
//# sourceMappingURL=schema.js.map