import {} from 'mocha';
const assert = require('assert');

import {
  TokenRankedListContract,
  Erc20Contract,
  VotersRegistryContract,
  CandidatesRegistryContract
} from '../src/services/frontier';

describe('Contracts should be innitialized with their addresses', () => {
  it('checks address of TRL Contract', () => {
    assert.equal(TokenRankedListContract._address.length, 42);
  });
  it('checks address of ERC20 Contract', () => {
    assert.equal(Erc20Contract._address.length, 42);
  });
  it('checks address of Candidate Registry Contract', () => {
    assert.equal(VotersRegistryContract._address.length, 42);
  });
  it('checks address of Voter Registry Contract', () => {
    assert.equal(CandidatesRegistryContract._address.length, 42);
  });
});