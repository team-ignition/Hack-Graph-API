import { IResolvers } from 'graphql-tools';
import * as _ from 'lodash';

const resolve = async (args: any, valueName: string, collection: any) => {
  const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));
  const params = Object.entries(filteredArgs)[0];
  const document = await collection.findOne(
    { [`event.${params[0]}`]: params[1] },
    { [`event.${valueName}`]: 1 }
  );
  return document.event[valueName];
};

const getResolver = async (candidatesCollection: any) => {
  const resolvers: IResolvers = {
    Event: {
      address: async (args: any) => {
        const result = await resolve(args, 'address', candidatesCollection);
        return result;
      },
      blockHash: async (args: any) => {
        const result = await resolve(args, 'blockHash', candidatesCollection);
        return result;
      },
      blockNumber: async (args: any) => {
        const result = await resolve(args, 'blockNumber', candidatesCollection);
        return result;
      },
      logIndex: async (args: any) => {
        const result = await resolve(args, 'logIndex', candidatesCollection);
        return result;
      },
      removed: async (args: any) => {
        const result = await resolve(args, 'removed', candidatesCollection);
        return result;
      },
      transactionHash: async (args: any) => {
        const result = await resolve(
          args,
          'transactionHash',
          candidatesCollection
        );
        return result;
      },
      transactionIndex: async (args: any) => {
        const result = await resolve(
          args,
          'transactionIndex',
          candidatesCollection
        );
        return result;
      },
      id: async (args: any) => {
        const result = await resolve(args, 'id', candidatesCollection);
        return result;
      },
      event: async (args: any) => {
        const result = await resolve(args, 'event', candidatesCollection);
        return result;
      },
      signature: async (args: any) => {
        const result = await resolve(args, 'signature', candidatesCollection);
        return result;
      }
    },

    Query: {
      event(
        obj,
        {
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
        }
      ) {
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
};

export default getResolver;
