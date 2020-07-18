'use strict';

module.exports = {
    default: (DB,userId,toAdd) => {
        if (!userId || !toAdd) throw new Error('addLevel: missing parameters');
        if (!parseInt(toAdd)) throw new Error('addLevel: toAdd needs to be a number');
        toAdd = parseInt(toAdd)
    
        const addLevelProm = new Promise(async (resolve, error) => {
    
          const Info = await DB.findOne({
            where: {
              userId: userId
            }
          });
          if (Info) {
    
            const Info2 = await DB.update({
              level: Info.level + toAdd
            }, {
              where: {
                userId: userId
              }
            });
            if (Info2 > 0) {
              return resolve({
                userId: userId,
                oldLevel: Info.level,
                newLevel: Info.level + toAdd,
              })
            }
            return error('addLevel: couldn\'t complete action 1')
          }
    
          return resolve('User has no record in database!')
    
        });
        return addLevelProm;
    }
}