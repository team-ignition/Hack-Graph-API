import { MongoClient } from 'mongodb';
const Bluebird = require('bluebird');
import config from '../../config';

const dbService = {
  async initializeDb() {
    try {
      const mongo: any = Bluebird.promisifyAll(MongoClient);
      const client: any = await mongo.connectAsync(config.db.uri, { useNewUrlParser: true });
      const db: any = client.db(config.db.name);
      return db;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  async createCollections(db: any) {
    try {
      const candidatesCollection: any = db.collection('candidates');
      const votersCollection: any = db.collection('voters');
      const votesCollection: any = db.collection('votes');

      return {
        candidatesCollection,
        votersCollection,
        votesCollection,
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};

export default dbService;
