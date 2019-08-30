const Sequelize = require('sequelize');
const queuing = require("./queue.js");
require('sqlite3');
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'Hot321', '132435465768798', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  storage: 'database.sqlite',
});

const DB = sequelize.define('Leveling', {
  userID: {
    type: Sequelize.STRING,
    unique: true,
  },
  xp: Sequelize.INTEGER,
  level: Sequelize.INTEGER
});

DB.sync()

console.log(`╔[════════════════Database Loaded═══════════════════════════════════════]╗
╔[════════════════If You Have Any Problems══════════════════════════════]╗
╔[════════════════Join https://discord.gg/Hc9rC8X On Discord════════════]╗`)

module.exports = {

  SetXp: function(UserID, toSet) {
    return dbQueue.addToQueue({
      "value": this._SetXp.bind(this),
      "args": [UserID, toSet]
    });
  },

  _SetXp: async function(UserID, toSet) {
    if (!UserID || toSet == undefined) throw new Error('SetXpSetXp function is missing parameters!')
    if (!parseInt(toSet) && toSet != 0) throw new Error('SetXp function parameter toSet needs to be a number!')
    toSet = parseInt(toSet)

    const SetProm = new Promise(async (resolve, error) => {

      const Info = await DB.update({
        xp: toSet
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info > 0) {
        return resolve({
          userid: UserID,
          xp: toSet
        })
      } else {

        try {
          const Info2 = await DB.create({
            userID: UserID,
            xp: 0
          });
          return resolve({
            userid: UserID,
            xp: toSet
          })
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
          }
          return error(e)
        }

      }

    });
    return SetProm;
  },

  SetLevel: function(UserID, toSet) {
    return dbQueue.addToQueue({
      "value": this._SetLevel.bind(this),
      "args": [UserID, toSet]
    });
  },

  _SetLevel: async function(UserID, toSet) {
    if (!UserID || toSet == undefined) throw new Error('SetLevel function is missing parameters!')
    if (!parseInt(toSet) && toSet != 0) throw new Error('SetLevel function parameter toSet needs to be a number!')
    toSet = parseInt(toSet)

    const SetProm = new Promise(async (resolve, error) => {

      const Info = await DB.update({
        level: toSet
      }, {
        where: {
          userID: UserID
        }
      });
      if (Info > 0) {
        return resolve({
          userid: UserID,
          level: toSet
        })
      } else {

        try {
          const Info2 = await DB.create({
            userID: UserID,
            level: 0
          });
          return resolve({
            userid: UserID,
            level: toSet
          })
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
          }
          return error(e)
        }

      }

    });
    return SetProm;
  },

  AddXp: function(UserID, toAdd) {
    return dbQueue.addToQueue({
      "value": this._AddXp.bind(this),
      "args": [UserID, toAdd]
    });
  },

  _AddXp: async function(UserID, toAdd) {
    if (!UserID || !toAdd) throw new Error('AddXp function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('AddXp function parameter toAdd needs to be a number!')
    toAdd = parseInt(toAdd)

    const AddProm = new Promise(async (resolve, error) => {

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {

        const Info2 = await DB.update({
          xp: Info.xp + toAdd
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldxp: Info.xp,
            newxp: Info.xp + toAdd,
          })
        }
        return error('Something went wrong in function AddXp')
      }

      return resolve('User has no record in database!')

    });
    return AddProm;
  },

  AddLevel: function(UserID, toAdd) {
    return dbQueue.addToQueue({
      "value": this._AddLevel.bind(this),
      "args": [UserID, toAdd]
    });
  },

  _AddLevel: async function(UserID, toAdd) {
    if (!UserID || !toAdd) throw new Error('AddLevel function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('AddLevel function parameter toAdd needs to be a number!')
    toAdd = parseInt(toAdd)

    const AddProm = new Promise(async (resolve, error) => {

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {

        const Info2 = await DB.update({
          level: Info.level + toAdd
        }, {
          where: {
            userID: UserID
          }
        });
        if (Info2 > 0) {
          return resolve({
            userid: UserID,
            oldlevel: Info.level,
            newlevel: Info.level + toAdd,
          })
        }
        return error('Something went wrong in function AddLevel')
      }

      return resolve('User has no record in database!')

    });
    return AddProm;
  },

  Delete: function(UserID) {
    return dbQueue.addToQueue({
      "value": this._Delete.bind(this),
      "args": [UserID]
    });
  },

  _Delete: async function(UserID) {
    if (!UserID) throw new Error('Delete function is missing parameters!')

    const DeleteProm = new Promise(async (resolve, error) => {

      const Info = await DB.destroy({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        return resolve({
          deleted: true
        })
      }

      return resolve({
        deleted: false
      })

    });
    return DeleteProm;
  },

  Fetch: function(UserID) {
    return dbQueue.addToQueue({
      "value": this._Fetch.bind(this),
      "args": [UserID]
    });
  },

  _Fetch: async function(UserID) {
    if (!UserID) throw new Error('Fetch function is missing parameters!')
    const FetchProm = new Promise(async (resolve, error) => {

      const Info = await DB.findOne({
        where: {
          userID: UserID
        }
      });
      if (Info) {
        return resolve({
          userid: Info.userID,
          xp: Info.xp,
          level: Info.level
        })
      }
      try {
        const Info2 = await DB.create({
          userID: UserID,
          xp: 0,
          level: 0
        });
        return resolve({
          userid: UserID,
          xp: 0,
          level: 0
        })
      } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
          return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
        }
        return error(e)
      }
    });
    return FetchProm;
  },

  Leaderboard: function(data = {}) {
    return dbQueue.addToQueue({
      "value": this._Leaderboard.bind(this),
      "args": [data]
    });
  },

  _Leaderboard: async function(data) {
    if (data.limit && !parseInt(data.limit)) throw new Error('Leaderboard function parameter obj.limit needs to be a number!')
    if (data.limit) data.limit = parseInt(data.limit)
    if (data.filter && !data.filter instanceof Function) throw new Error('Leaderboard function parameter obj.filter needs to be a function!')
    if (!data.filter) data.filter = x => x;
    const LeaderboardProm = new Promise(async (resolve, error) => {

      if (data.search) {

        const Info = await DB.findAll({
          where: {
            xp: {
              [Sequelize.Op.gt]: 0
            },
            level: {
              [Sequelize.Op.gt]: 0
            }
          }
        })

        let output = Info.map(l => new Object({
          userid: l.userID,
          level: l.level,
          xp: l.xp
        })).sort((a, b) => {

          if (parseInt(b.level) > parseInt(a.level)) return 1;
          if (parseInt(b.level) == parseInt(a.level) && parseInt(b.xp) > parseInt(a.xp)) return 1;
          return -1;

        }).filter(data.filter).slice(0, data.limit).findIndex(l => l.userid == data.search)

        if (output == -1) return resolve('Not found')
        return resolve(output + 1)

      } else {

        const Info = await DB.findAll({
          where: {
            xp: {
              [Sequelize.Op.gt]: 0
            },
            level: {
              [Sequelize.Op.gt]: 0
            }
          }
        })

        let output = Info.map(l => new Object({
          userid: l.userID,
          level: l.level,
          xp: l.xp
        })).sort((a, b) => {

          if (parseInt(b.level) > parseInt(a.level)) return 1;
          if (parseInt(b.level) == parseInt(a.level) && parseInt(b.xp) > parseInt(a.xp)) return 1;
          return -1;

        }).filter(data.filter).slice(0, data.limit)

        return resolve(output)

      }

    });
    return LeaderboardProm;
  }

}
