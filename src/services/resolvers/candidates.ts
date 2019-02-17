import { IFieldResolver, IResolvers } from 'graphql-tools';
import applyPagination from './util'
const _ = require('lodash')

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
  _candidateAddress?: [string];
  _totalAmountOfVotes?: [number];
  _votersAmount?: [number];
  _periodIndex?: [number];
  first?: number;
  last?: number;
}

const getResolver = async (candidatesCollection: any) => {
  const candidates: IFieldResolver<any, any> = async (
    obj,
    args: IVotesArgs
  ) => {
    const filteredArgs = _.pickBy(args, _.negate(_.isUndefined));

    const document = await candidatesCollection.aggregate([
      {
        $match: filteredArgs._candidateAddress ? { 'event.returnValues._whiteListedAccount': { $regex: filteredArgs._candidateAddress, $options: 'i' } } : {}
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
                      { $eq: ['$event.returnValues._periodIndex', filteredArgs._periodIndex] },
                      { $eq: ['$event.returnValues._candidateAddress', '$$localAddress'] }
                    ]
                }
              }
            },
            {
              // Group votes by voters, and sum all their votes
              $group: {
                _id: '$event.returnValues._voterAddress',
                totalAmount: { $sum: '$event.returnValues._amount' }
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
          // As we group the votes by voters, we know the amount of voters with the size of the group
          'event.returnValues._votersAmount': { $size: '$event.returnValues.candidate_votes' },
          'event.returnValues._totalAmountOfVotes': {
            $cond: {
              if: { $gt: [{ $size: '$event.returnValues.candidate_votes' }, 0] },
              then: { $sum: '$event.returnValues.candidate_votes.totalAmount' },
              else: 0
            }
          }
        }
      },
      { $sort: { 'event.returnValues._totalAmountOfVotes': -1 } }
    ]).toArray();

    return document.map((key: any) => key.event.returnValues);
  };

  const resolvers: IResolvers = {
    Candidate: {
      _candidateAddress: async (args: any) => {
        if (args._candidateAddress) return args._candidateAddress;
        return resolve(args, '_whiteListedAccount', candidatesCollection);
      },
      _totalAmountOfVotes: async (args: any) => {
        if (_.isInteger(args._totalAmountOfVotes)) return args._totalAmountOfVotes;
        return resolve(args, '_totalAmountOfVotes', candidatesCollection);
      },
      _votersAmount: async (args: any) => {
        if (_.isInteger(args._votersAmount)) return args._votersAmount;
        return resolve(args, '_votersAmount', candidatesCollection);
      }
    },

    Query: {
      candidate(
        obj,
        { _candidatesAddress, _totalAmountOfVotes, _periodIndex, _votes }
      ) {
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
};

export default getResolver;