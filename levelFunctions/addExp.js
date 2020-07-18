module.exports = {
    default: (DB,userId,toAdd) => {
        if (!userId || !toAdd) throw new Error('addExp: missing parameters')
        if (!parseInt(toAdd)) throw new Error('addExp: toAdd needs to be a number')
        toAdd = parseInt(toAdd)
    
        const addExpProm = new Promise(async (resolve, error) => {
    
          const Info = await DB.findOne({
            where: {
              userId: userId
            }
          });
          if (Info) {
    
            const Info2 = await DB.update({
              exp: Info.xp + toAdd
            }, {
              where: {
                userId: userId
              }
            });
            if (Info2 > 0) {
              return resolve({
                userId: userId,
                oldExp: Info.xp,
                newExp: Info.xp + toAdd,
              })
            }
            return error('addExp: couldn\'t complete action 1')
          }
    
          return resolve('User has no record in database!')
    
        });
        return AddProm;
    }
}