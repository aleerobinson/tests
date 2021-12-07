//EXAMPLE ONLY, DON'T CHECK IN SECRETS
//Example of what the sequelize env.js file should contain.

const mssqlDbCreds = {
  host: 'blah.domain.com',
  db: 'myDBName',
  user: 'admin',
  pass: 'secret123',
};

const dbDialects = {
  mssql: mssqlDbCreds,
};

module.exports = {
  dbDialects,
};
