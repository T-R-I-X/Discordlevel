'use strict';

module.exports = {
    default: (DB,userId,toSet) => {
        if (!userId || toSet == undefined) throw new Error('setExp: missing parameters');

        if (!parseInt(toSet) && toSet != 0) throw new Error('setExp: toSet needs to be a number');
        toSet = parseInt(toSet);
    
        const setExpProm = new Promise(async (resolve, error) => {
    
          const Info = await DB.update({
            exp: toSet
          }, {
            where: {
              userId: userId
            }
          });
          if (Info > 0) {
            return resolve({
              userId: userId,
              newExp: toSet
            })
          } else {
    
            try {
              const Info2 = await DB.create({
                userId: userId,
                exp: 0
              });
              return resolve({
                userId: userId,
                newExp: toSet
              })
            } catch (e) {
              if (e.name === 'SequelizeUniqueConstraintError') {
                return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
              }
              return error(e)
            }
    
          }
    
        });
        return setExpProm;
    }
}