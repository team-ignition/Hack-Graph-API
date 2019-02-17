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
const body_parser_1 = __importDefault(require("body-parser"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const schema_1 = __importDefault(require("./schema"));
const routes = (votesCollection, candidatesCollection, votersCollection, app) => __awaiter(this, void 0, void 0, function* () {
    app.use(body_parser_1.default.json());
    /*
     * GRAPHQL API
     */
    const schema = yield schema_1.default(candidatesCollection, votersCollection, votesCollection);
    app.use('/graphql', express_graphql_1.default({
        schema,
        graphiql: true
    }));
});
exports.default = routes;
//# sourceMappingURL=routesService.js.map