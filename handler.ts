import { APIGatewayEvent, Handler } from 'aws-lambda';
import { graphql } from 'graphql';
import createSchema from './src/services/schema';
import dbService from './src/services/dbService';
import config from './config'

let schema: any;
let collections: any;

async function getCollections() {
  if (collections === undefined) {
    const db = await dbService.initializeDb();
    collections = await dbService.createCollections(db);
    return collections;
  } else {
    return collections;
  }
}

async function executableSchema() {
  if (schema === undefined) {
    const db = await dbService.initializeDb();
    collections = await dbService.createCollections(db);
    schema = await createSchema(collections);
    return schema;
  } else {
    return schema
  }
}

export const whoIamHandler: Handler = async (event: APIGatewayEvent) => {
  let response: any = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    statusCode: 200,
    body: undefined
  };
  try {
    collections = await getCollections();
    const body = JSON.parse(event.body);
    const account = body.account.toLowerCase();
    if (config.adminAccount === account) {
      response.body = JSON.stringify({ result: { exist: true, role: "owner" } });
    } else {
      const user = await collections.candidatesCollection.findOne({ "event.returnValues._whiteListedAccount": { $regex: new RegExp(account, "i") } })
      if (user !== null) {
        response.body = JSON.stringify({ result: { exist: true, role: 'candidate' } });
      } else {
        const user = await collections.votersCollection.findOne({ "event.returnValues._whiteListedAccount": { $regex: new RegExp(account, "i") } })
        if (user !== null) {
          response.body = JSON.stringify({ result: { exist: true, role: "voter" } });
        } else {
          response.body = JSON.stringify({ result: { exist: false, role: "viewer" } });
        }
      }
    }
  } catch (error) {
    console.error(error);
    response = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
  return response;
}

export const graphqlHandler: Handler = async (event: APIGatewayEvent) => {
  let response;
  try {
    schema = await executableSchema()
    const body = JSON.parse(event.body);
    const handler = await graphql(schema, body.query);
    response = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      statusCode: 200,
      body: JSON.stringify(handler),
    }
  } catch (error) {
    console.error(error)
    response = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
  return response;
};