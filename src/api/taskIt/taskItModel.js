const { knex, makeParameterKnex } = require("../../knex");

class taskItModel {
  onGetReport(obj) {
    const { submit_sd, submit_ed } = obj;
    const data = [
      "05D4A0EC-2BB5-4686-B222-DE1A10DF1771",
      "",
      "",
      "",
      "",
      "",
      "",
    ];
    const str = makeParameterKnex(data);
    return knex.raw(`EXEC DCLS_Approval_GetReport ${str}`, data);
  }

  insertRemarkComment(obj) {
    return knex("DMAT_ApproveRemark").insert(obj);
  }

  selectRemarkComment(obj) {
    return knex("DMAT_ApproveRemark").where(obj);
  }

  selectUserIt(obj) {
    return knex("DMAT_UserItFollowUpTask").where(obj);
  }

  getUserMaster(obj) {
    return knex("DCLT_UserMaster").where(obj);
  }
}

module.exports = new taskItModel();
