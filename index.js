'use strict';

//-- Constants
const Sequelize = require('sequelize');
const queuing = require("./queue.js");
require('sqlite3');
const dbQueue = new queuing();

const sequelize = new Sequelize('level', '3njnds@DjsdMsa', 'pdsAL@d23MDsaKsda', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: 0,
  operatorsAliases: 0,
  storage: 'level.sqlite',
});

const DB = sequelize.define('Leveling', {
  userId: {
    type: Sequelize.STRING,
    unique: true,
  },
  exp: Sequelize.INTEGER,
  level: Sequelize.INTEGER
});
DB.sync()

module.exports = {

  /**
   * @param {integer} userId 
   * @param {integer} toSet 
   */
  setExp: function(userId, toSet) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/setExp').default.bind(this),
      "args": [DB,userId, toSet]
    });
  },

  /**
   * @param {integer} userId 
   * @param {integer} toSet 
   */
  setLevel: function(userId, toSet) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/setLevel').default.bind(this),
      "args": [DB,userId, toSet]
    });
  },

  /**
   * @param {integer} userId 
   * @param {integer} toAdd 
   */
  addExp: function(userId, toAdd) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/addExp').default.bind(this),
      "args": [DB,userId, toAdd]
    });
  },

  /**
   * @param {integer} userId 
   * @param {integer} toAdd 
   */
  addLevel: function(userId, toAdd) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/addLevel').default.bind(this),
      "args": [DB,userId, toAdd]
    });
  },

  /**
   * @param {integer} userId 
   */
  levelDelete: function(userId) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/levelDelete').default.bind(this),
      "args": [DB,userId]
    });
  },

  /**
   * @param {integer} userId 
   */
  fetchLevel: function(userId) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/fetchLevel').default.bind(this),
      "args": [DB,userId]
    });
  },

  /**
   * @param {parmaeter} data
   * @param {integer} data.limit
   * @param {function} data.filter 
   * @param {integer} data.search
   */
  levelLeaderboard: function(data = {}) {
    return dbQueue.addToQueue({
      "value": require('./levelFunctions/levelLeaderboard').default.bind(this),
      "args": [DB,data]
    });
  }
}
