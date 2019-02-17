export default {
  name: 'trl-events-api',
  version: 'POC-v2',
  env: process.env.NODE_ENV || 'development',
  node_uri: process.env.NODE_URI || 'https://rinkeby.infura.io',
  strictRouting: true,
  adminAccount: process.env.ADMIN_ACCOUNT || '0x00b8fbd65d61b7dfe34b9a3bb6c81908d7ffd541',
  db: {
    uri: process.env.DB_URI,
    name: process.env.DB_NAME || 'beta-cache'
  },
  rabbit: {
    uri: process.env.RABBIT_URI || 'amqp://localhost',
    name: process.env.RABBIT_NAME || 'trl'
  }
};
