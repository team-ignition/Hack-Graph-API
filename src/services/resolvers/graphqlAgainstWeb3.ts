import { IFieldResolver, IResolvers } from 'graphql-tools';
const _ = require('lodash');
import frontier from "./../frontier"


interface IAmountArgs {
    _periodIndex: number;
    _voterAddress: string;
}

  const votesBalance: IFieldResolver<any, any> = async (
    obj,
    args: IAmountArgs
  ) => {
    const tokenBalance = await frontier.contracts.TokenRankedList.votesBalance(args._periodIndex, args._voterAddress);
    return tokenBalance;

  };

const resolvers: IResolvers = {
    VotesBalance: {
      _amount: async (tokenBalance: any) => {
        if (tokenBalance) return tokenBalance;
      }
    },
    Query: {
        votesBalance
    }
};


export default resolvers;
