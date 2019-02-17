import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import typeDefs from './schemas/typesDefs';
import getResolverOwned from './resolvers/ownedRegistryContract';
import getResolverVotes from './resolvers/votes';
import getResolverCandidates from './resolvers/candidates';
import getResolverVoters from './resolvers/voters';
import graphqlAgainstWeb3Resolver from './resolvers/graphqlAgainstWeb3'
import * as _ from 'lodash';

const createSchema = async (collections: any) => {
  const ownedRegistryContractResolvers = await getResolverOwned(collections.candidatesCollection);
  const votesResolver = await getResolverVotes(collections.votesCollection);
  const candidatesResolver = await getResolverCandidates(collections.candidatesCollection);
  const votersResolver = await getResolverVoters(collections.votersCollection);

  const resolvers = _.merge([
    ownedRegistryContractResolvers,
    votesResolver,
    candidatesResolver,
    votersResolver,
    graphqlAgainstWeb3Resolver
  ]) as IResolvers;

  return makeExecutableSchema({ typeDefs, resolvers });
};

export default createSchema;
