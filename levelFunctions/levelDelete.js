'use strict';

module.exports = {
    default: (DB,userId) => {
        if (!userId) throw new Error('levelDelete: missing parameters')

        const levelDeleteProm = new Promise(async (resolve, error) => {
    
          const Info = await DB.destroy({
            where: {
              userId: userId
            }
          });
          if (Info) {
            return resolve({
              userId: userId,
              deleted: true
            })
          }
    
          return resolve({
            userId: userId,
            deleted: false
          })
    
        });
        return levelDeleteProm;
    }
}