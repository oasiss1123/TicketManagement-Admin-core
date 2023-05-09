const knex = require('../knex');

exports.transaction = async (items = []) =>
    new Promise((resolve, reject) => {
        console.log('--- START TRANSACTION --- ')
        knex.transaction(async trx => {
            return await Promise.all(items.map(el => el(trx)))
                .then(trx.commit)
                .catch(trx.rollback)
        })
            .then(() => {
                console.log('COMMIT');
                resolve(true)
            })
            .catch((error) => {
                reject(error)
                console.log('ROLLBACK')
            })
    })