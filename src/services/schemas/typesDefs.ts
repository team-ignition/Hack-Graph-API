export default `
schema {
  query: Query
}

type Query {
  "Selects a account block based on etheir an address, a blockHash, a blockNumber, a logIndex, a transactionHash, transactionIndex or id."
  event(
    address: String
    blockHash: String
    blockNumber: Int
    logIndex: Int
    removed: Boolean
    transactionHash: String
    transactionIndex: Int
    id: String
    event: String
    signature: String
  ): Event

  vote(
    _candidateAddress: String
    _voterAddress: String
    _amount: Int
    _periodIndex: Int
    _transactionHash: String
  ): Vote

  votes(
    _candidateAddress: String
    _voterAddress: String
    _amount: Int
    _periodIndex: Int
    first: Int
    last: Int
  ): [Vote]

  candidate(_candidateAddress: String, _totalAmountOfVotes: Int): Candidate

  candidates(
    _candidateAddress: String
    _totalAmountOfVotes: Int
    _periodIndex: Int
    first: Int
    last: Int
  ): [Candidate]

  voter(
    _voterAddress: String
    _tokensRemaining: Int
    _tokensStaked: Int
    _tokensUsed: Int
  ): Voter

  voters(
    _voterAddress: String
    _tokensRemaining: Int
    _tokensStaked: Int
    _tokensUsed: Int
    _periodIndex: Int
    first: Int
    last: Int
  ): [Voter]

  totalAmountOfVotes(
    _periodIndex: Int
  ): TotalAmountOfVotes

  votesBalance(_periodIndex: Int, _voterAddress: String): VotesBalance
}

type Vote {
  id: ID
  _candidateAddress: String
  _voterAddress: String
  _amount: Int
  _periodIndex: Int
  _transactionHash: String
}

type Candidate {
  id: ID
  _candidateAddress: String
  _votersAmount: Int
  _totalAmountOfVotes: Int
}

type Voter {
  id: ID
  _voterAddress: String
  _tokensRemaining: Int
  _tokensStaked: Int
  _tokensUsed: Int
}

type TotalAmountOfVotes {
  _periodIndex: Int
  _amount: Int
}

type VotesBalance {
  _amount: Int
}

type Event {
  "The address of this event."
  address: String

  "The block hash of this event."
  blockHash: String

  "The block number of this event."
  blockNumber: Int

  "The log index of this event."
  logIndex: Int

  removed: Boolean

  "The transaction hash of this event."
  transactionHash: String

  "The transaction index of this event."
  transactionIndex: Int

  "The transaction id of this event."
  id: String

  "The name of this event."
  event: String

  "The signature of this event."
  signature: String
}`;
