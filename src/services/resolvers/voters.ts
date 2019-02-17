import { IFieldResolver, IResolvers } from 'graphql-tools';
import applyPagination from './util';
const _ = require('lodash')
import frontier from '../frontier';

const resolve = async (args: any, valueName: string, collection: any) => {
  const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));
  const params = Object.entries(filteredArgs)[0];
  let document = await collection.findOne(
    { [`event.returnValues.${params[0]}`]: params[1].toString() },
    { [`event.returnValues.${valueName}`]: 1 }
  );

  if (document === null) {
    document = { event: { returnValues: { [valueName]: undefined } } };
  }
  return document.event.returnValues[valueName];
};

interface IVotesArgs {
  _voterAddress?: [string];
  _tokensRemaining?: [number];
  _tokensStaked?: [number];
  _tokensUsed?: [number];
  _periodIndex?: [number];
  first?: number;
  last?: number;
}

const getResolver = async (votersCollection: any) => {
  const voters: IFieldResolver<any, any> = async (obj, args: IVotesArgs) => {
    const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));

    const document = await votersCollection.aggregate([
      {
        $match: filteredArgs._voterAddress ? { 'event.returnValues._whiteListedAccount': { $regex: filteredArgs._voterAddress, $options: 'i' } } : {}
      },
      {
        $lookup: {
          from: 'votes',
          let: { localAddress: '$event.returnValues._whiteListedAccount' },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
                      { $eq: [`$event.returnValues._periodIndex`, filteredArgs._periodIndex] },
                      { $eq: ['$event.returnValues._voterAddress', '$$localAddress'] }
                    ]
                }
              }
            }
          ],
          as: 'event.returnValues.voter_votes'
        }
      },
      {
        $project: {
          _id: '$_id',
          'event.returnValues._voterAddress': '$event.returnValues._whiteListedAccount',
          'event.returnValues.voter_votes': 1,
          'event.returnValues._tokensUsed': {
            $cond: {
              if: { $gt: [{ $size: '$event.returnValues.voter_votes' }, 0] },
              then: { $sum: '$event.returnValues.voter_votes.event.returnValues._amount' },
              else: 0
            }
          },
          'event.returnValues._periodIndex': {
            $sum: filteredArgs._periodIndex
          }
        }
      },
      { $sort: { 'event.returnValues._tokensUsed': -1 } }
    ]).toArray();

    return document.map((key: any) => key.event.returnValues);
  };

  const resolvers: IResolvers = {
    Voter: {
      _voterAddress: async (args: any) => {
        if (args._voterAddress) return args._voterAddress;
        return resolve(args, '_whiteListedAccount', votersCollection);
      },
      _tokensRemaining: async (args: any) => {
        if (args._tokensRemaining) return args._tokensRemaining;
        return (
          frontier.contracts.TokenRankedList.votesBalance(
            args._periodIndex,
            args._voterAddress
          )
        );
      },
      _tokensUsed: async (args: any) => {
        if (_.isInteger(args._tokensUsed)) return args._tokensUsed;
        return resolve(args, '_tokensUsed', votersCollection);
      },
      _tokensStaked: async (args: any) => {
        if (args._tokensStaked) return args._tokensStaked;
        const tokensRemaining = await frontier.contracts.TokenRankedList.votesBalance(
          args._periodIndex,
          args._voterAddress
        );
        return args._tokensUsed + tokensRemaining;
      }
    },

    Query: {
      voter(
        obj,
        {
          _voterAddress,
          _tokensRemaining,
          _tokensStaked,
          _tokensUsed,
          _periodIndex
        }
      ) {
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
};

export default getResolver;
