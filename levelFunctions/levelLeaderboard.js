'use strict';

module.exports = {
    default: (DB,data) => {
        if (data.limit && !parseInt(data.limit)) throw new Error('levelLeaderboard: data.limit needs to be a number');
        if (data.limit) data.limit = parseInt(data.limit);
        
        if (data.filter && !data.filter instanceof Function) throw new Error('levelLeaderboard data.filter needs to be a function');
        if (!data.filter) data.filter = x => x;
        
        const levelLeaderboardProm = new Promise(async (resolve, error) => {
    
          if (data.search) {
    
            const Info = await DB.findAll({
              where: {
                exp: {
                  [Sequelize.Op.gt]: 0
                },
                level: {
                  [Sequelize.Op.gt]: 0
                }
              }
            });
    
            let output = Info.map(l => new Object({
              userId: l.userId,
              level: l.level,
              exp: l.exp
            })).sort((a, b) => {
    
              if (parseInt(b.level) > parseInt(a.level)) return 1;
              if (parseInt(b.level) == parseInt(a.level) && parseInt(b.exp) > parseInt(a.exp)) return 1;
              return -1;
    
            }).filter(data.filter).slice(0, data.limit).findIndex(l => l.userId == data.search);
    
            if (output == -1) return resolve('Not found');
            return resolve(output + 1);
    
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
            });
    
            let output = Info.map(l => new Object({
              userId: l.userId,
              level: l.level,
              exp: l.exp
            })).sort((a, b) => {
    
              if (parseInt(b.level) > parseInt(a.level)) return 1;
              if (parseInt(b.level) == parseInt(a.level) && parseInt(b.exp) > parseInt(a.exp)) return 1;
              return -1;
    
            }).filter(data.filter).slice(0, data.limit);
    
            return resolve(output);
    
          }
    
        });
        return levelLeaderboardProm;
      }
}