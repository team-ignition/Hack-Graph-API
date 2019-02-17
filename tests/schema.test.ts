
global.should = require('chai').should();
import 'mocha';
import { expect } from 'chai';
import { mockServer } from 'graphql-tools';
import casual from 'casual-browserify';

// The GraphQL schema. Described in more detail here:
// https://medium.com/apollo-stack/the-apollo-server-bc68762e93b
const schema: string = `
  type RootQuery {
    vote(_periodIndex: ID): Vote
  }
  type Vote {
    id: ID
    _candidateAddress: String
    _voterAddress: String
    _amount: Int
    _periodIndex: Int
  }
  schema {
    query: RootQuery
  }
`;

// Mock functions are defined per type and return an
// object with some or all of the fields of that type.
// If a field on the object is a function, that function
// will be used to resolve the field if the query requests it.

describe('OwnedRegistryContract', () => {
  const server: any = mockServer(schema, {
    RootQuery: () => ({
      vote: (o: any, { _periodIndex }: any) => ({ _periodIndex })
    }),
    Vote: () => ({
      _candidateAddress: () => casual.word,
      _voterAddress: () => casual.word,
      _amount: () => Math.random(),
      _periodIndex: () => Math.random()
    })
  });

  it('has valid type definitions', async () => {
    expect(async () => {
      await server
        .query(
          `
          {
          votes(_periodIndex: 0) {
            _amount
            _candidateAddress
            _voterAddress
            _periodIndex
          }
        }
      }`
        )
        .not.throw();
    });
  });
});
