const { knex } = require('../../knex')
class authenModel {
    onGetUserDetailByDplusID({ dplus_id }) {
        return knex.raw(`EXEC DCLS_User_GetDetailByDplus ?`, [dplus_id]);
    }

    onLoginGoogle({ dplus_id }) {
        return knex.raw(`EXEC DCLS_Authen_LoginGoogle ?`, [dplus_id])
    }
}

module.exports = new authenModel();