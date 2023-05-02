const {connect, connection} = require('mongoose');

const connectionString =
  process.env.MONGOD_URI || 'mongodb://127.0.0.1:27017/socialNetwork';

connect(connectionString);

module.exports = connection;