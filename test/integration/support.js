'use strict';

const Support = require('../support');

const runningQueries = new Set();

before(function() {
  this.sequelize.hooks.add('beforeQuery', (options, query) => {
    runningQueries.add(query);
  });
  this.sequelize.hooks.add('afterQuery', (options, query) => {
    runningQueries.delete(query);
  });
});

beforeEach(function() {
  return Support.clearDatabase(this.sequelize);
});

afterEach(function() {
  if (runningQueries.size === 0) {
    return;
  }
  let msg = `Expected 0 running queries. ${runningQueries.size} queries still running in ${this.currentTest.fullTitle()}\n`;
  msg += 'Queries:\n\n';
  msg += [...runningQueries].map(query => `${query.uuid}: ${query.sql}`).join('\n');
  throw new Error(msg);
});

module.exports = Support;
