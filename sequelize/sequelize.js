const Sequelize = require('sequelize');
const {dbDialects} = require('./env');

let cache = {};

const _init = async (dialect, models = {}) => {
  const {host, db, user, pass} = dbDialects[dialect];
  const options = {
    dialect,
    host,
    pool: {max: 100},
  };
  const sequelize = new Sequelize(db, user, pass, options);

  await sequelize.authenticate();

  Object.entries(models).forEach(([modelName, {options, definition}]) =>
    sequelize.define(modelName, definition, options)
  );

  return sequelize;
};

const getSequelize = async (dialect, models = {}) => {
  const modelsString = JSON.stringify(models);
  const cacheKey = `${dialect}-${modelsString}`;

  if (!cache[cacheKey]) {
    cache[cacheKey] = _init(dialect, models);
  }

  return cache[cacheKey];
};

module.exports = {
  getSequelize,
};
