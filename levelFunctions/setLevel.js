module.exports = {
    default: (DB,userId,toSet) => {
        if (!userId || toSet == undefined) throw new Error('setLevel: missing parameters');
        
        if (!parseInt(toSet) && toSet != 0) throw new Error('setLevel: toSet needs to be a number');
        toSet = parseInt(toSet);
    
        const setLevelProm = new Promise(async (resolve, error) => {
    
          const Info = await DB.update({
            level: toSet
          }, {
            where: {
              userId: userId
            }
          });
          if (Info > 0) {
            return resolve({
              userId: userId,
              newLevel: toSet
            })
          } else {
    
            try {
              const Info2 = await DB.create({
                userId: userId,
                level: 0
              });
              return resolve({
                userId: userId,
                newLevel: toSet
              })
            } catch (e) {
              if (e.name === 'SequelizeUniqueConstraintError') {
                return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
              }
              return error(e)
            }
    
          }
    
        });
        return setLevelProm;
    }
}