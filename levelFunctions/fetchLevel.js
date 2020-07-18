'use strict';

module.exports = {
    default: (DB,userId) => {
        if (!userId) throw new Error('fetchLevel: missing parameters')
        
        const fetchLevelProm = new Promise(async (resolve, error) => {
    
          const Info = await DB.findOne({
            where: {
              userId: userId
            }
          });
          if (Info) {
            return resolve({
              userId: userId,
              exp: Info.xp,
              level: Info.level
            })
          }
          try {
            const Info2 = await DB.create({
              userId: userId,
              exp: 0,
              level: 0
            });
            return resolve({
              userId: userId,
              exp: 0,
              level: 0
            })
          } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
              return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
            }
            return error(e)
          }
        });
        return fetchLevelProm;
    }
}