const { debug, err } = require('../config/debug');
const { env } = require('../env');
const config = require('./knexfile')
const environ = env.node;
const knex = require('knex')(config[environ])


const testConnect = async () => {
    try {
        if ((env.db.dev.host !== 'xxxx')) {
            await Promise.all([
                knex.raw('select 1+1 as result'),
            ])
            return debug(`====== CONNECT DATABASE SUCCESS ======`);
        }

        debug(`!!! PLEASE CONFIG DATABASE !!!`);
    } catch (error) {
        console.log(error)
        debug(`====== CONNECT DATABASE FALIED ======`);
    }
}

testConnect();

module.exports = {
    knex,
    makeParameterKnex: (data = []) => {
        return [...'?'.repeat(data.length)].join(', ');
    }
};