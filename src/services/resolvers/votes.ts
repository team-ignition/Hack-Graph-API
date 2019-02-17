import { IFieldResolver, IResolvers } from 'graphql-tools';
import applyPagination from './util';
const _ = require('lodash');

const resolve = async (args: any, valueName: string, collection: any) => {
  const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));
  const params = Object.entries(filteredArgs)[0];
  const document = await collection.findOne(
    { [`event.returnValues.${params[0]}`]: params[1] },
    { [`event.returnValues.${valueName}`]: 1 }
  );

  return document.event.returnValues[valueName];
};

interface IVotesArgs {
  _candidateAddress?: [string];
  _voterAddress?: [string];
  _amount?: [number];
  _periodIndex?: [number];
  first?: number;
  last?: number;
}

interface IAmountArgs {
  _periodIndex?: [number];
}

const getResolver = async (votesCollection: any) => {
  const votes: IFieldResolver<any, any> = async (obj, args: IVotesArgs) => {
    const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));
    const params = Object.entries(filteredArgs);

    const query = {};
    params.forEach((condition) => {
      const match = typeof condition[1] === 'string' ? { $regex: condition[1], $options: 'i' } : condition[1];
      query[`event.returnValues.${condition[0]}`] = match;
    });

    const document = await votesCollection.find(
      query,
      {
        sort: {
          'event.blockNumber': 1
        },
        fields: {
          'event.returnValues': 1,
          'event.transactionHash': 1
        }
      }
    ).toArray();

    return document.map((key: any) => {
      return Object.assign({}, key.event.returnValues, { _transactionHash: key.event.transactionHash || '' });
    });
  };

  const totalAmountOfVotes: IFieldResolver<any, any> = async (
    obj,
    args: IAmountArgs
  ) => {
    const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));
    const params = Object.entries(filteredArgs)[0];

    const document = await votesCollection.aggregate([
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

    const array = await document.toArray();

    return array.map((key: any) => key.event.returnValues);
  };

  const resolvers: IResolvers = {
    Vote: {
      _candidateAddress: async (args: any) => {
        if (args._candidateAddress) return args._candidateAddress;
        return resolve(args, '_candidateAddress', votesCollection);
      },
      _voterAddress: async (args: any) => {
        if (args._voterAddress) return args._voterAddress;
        return resolve(args, '_voterAddress', votesCollection);
      },
      _amount: async (args: any) => {
        if (args._amount) return args._amount;
        return resolve(args, '_amount', votesCollection);
      },
      _periodIndex: async (args: any) => {
        if (args._periodIndex) return args._periodIndex;
        return resolve(args, '_periodIndex', votesCollection);
      },
      _transactionHash: async (args: any) => {
        return args._transactionHash || '';
      }
    },

    TotalAmountOfVotes: {
      _periodIndex: async (args: any) => {
        if (args[0]._periodIndex) return args[0]._periodIndex;
      },
      _amount: async (args: any) => {
        if (args[0]._amount) return args[0]._amount;
      }
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
};

export default getResolver;
