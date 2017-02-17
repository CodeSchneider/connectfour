
module.exports.connections = {

  mysqlDev: {
    adapter: 'sails-mysql',
    host: 'localhost',
    user: 'root',
    database: 'connectfour'
  },

  mysqlProd: {
    adapter: 'sails-mysql',
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_pw,
    database: process.env.db_name
  },

  psqlProd: {
    adapter: 'sails-postgresql',
    host: process.env.PSQL_HOST,
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASSWORD,
    port: 5432,
    ssl: true,
    database: process.env.PSQL_DATABASE
  }



};
