import { } from 'mocha';
import { expect } from 'chai';
import { graphqlHandler } from './../handler';

import mockDb from './mockDb';


function graphqlQuery(query: any) {
  const event = { body: `{"query":"${query}"}` }
  return graphqlHandler(event, null, null);
}

before(async function () {
  this.timeout(0);
  await mockDb();
});

describe('Integration', async () => {
  it('Should resolve votes', async () => {
    const query: any = `{candidates(_periodIndex: 0) {_candidateAddress _totalAmountOfVotes _votersAmount}}`;
    const expected = {
      'data': {
        'candidates': [
          {
            '_candidateAddress': '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B',
            '_totalAmountOfVotes': 20,
            '_votersAmount': 1
          }
        ]
      }
    };
    const response = await graphqlQuery(query);
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.have.deep.equals(expected);
  });

  it('Should resolve votes by voter', async () => {
    const query: any = String.raw`{votes(_voterAddress: \"0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D\" ) {_candidateAddress _voterAddress _amount _periodIndex _transactionHash}}`;
    const expected = {
      data: {
        votes: [
          {
            '_candidateAddress': '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B',
            '_voterAddress': '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
            '_amount': 10,
            '_periodIndex': 0,
            '_transactionHash': '0x777d588d62091be21393d32806e5a011f5e55b95d926bcc62892e9f80f0d7c63'
          },
          {
            '_candidateAddress': '0xf6f6C0cb9C979B58cdB461e9214b8E69370EeC3B',
            '_voterAddress': '0xA7Fb216cc527E071b1C68E5Aa321D9625906F09D',
            '_amount': 10,
            '_periodIndex': 0,
            '_transactionHash': '0x92add3176dd7309823e654a3b55ca57b9ac93610228904245855c170e6403109'
          }
        ]
      }
    };
    const response = await graphqlQuery(query);
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.have.deep.equals(expected);
  });
});

describe('Voters', async () => {
  it('Should receive tokens used and staked', async () => {
    const query: any = String.raw`{voters (_periodIndex: 1, _voterAddress: \"0x9B2828ef19b39De73d5F81A688dF35939AC5fDC0\") {_voterAddress _tokensUsed _tokensStaked}}`;
    const expected = {
      data: {
        voters: [
          {
            _voterAddress: '0x9B2828ef19b39De73d5F81A688dF35939AC5fDC0',
            _tokensUsed: 0,
            _tokensStaked: 96
          }
        ]
      }
    };
    const response = await graphqlQuery(query);
    expect(response.statusCode).to.equal(200);
    expect(JSON.parse(response.body)).to.have.deep.equals(expected);
  });
});
