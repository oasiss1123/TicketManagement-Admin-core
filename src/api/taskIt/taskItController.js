const taskItModel = require("./taskItModel");
const { success, failed } = require("../../config/response");
const {
  option_station,
  option_urgency,
  onGetUserDetail,
  convertStatusTimeLine,
} = require("./taskItFn");
const { GET } = require("../../helpers/service");
const moment = require("moment");
const { env } = require("../../env.js");
const { POST_LARK, POST_LARK_V2, GET_LARK } = require("../../helpers/lark.js");
const { POST } = require("../../helpers/service");
const axios = require("axios");

class taskItController {
  async selectTaskIt(req, res) {
    const {
      request_no,
      status,
      submit_sd,
      submit_ed,
      requesters_name,
      department_sup,
      urgency,
      type_desired,
      accessory_hw,
      it_comment,
      it_followup,
      pr_ep,
    } = req.body;
    const { lark_token } = req;
    try {
      const query = await taskItModel.onGetReport({
        submit_sd,
        submit_ed,
      });
      if (!query || query.length <= 0) {
        return success(res, "ดึงข้อมูลสำเร็จ", []);
      }
      const urls = query.map((e) => ({
        ...e,
        form_url: e.form_path,
      }));

      let result = await Promise.all(
        urls.map(async (el) => {
          try {
            const get_data = await GET(el.form_url);
            if (get_data && !get_data.code) {
              const { data } = get_data;
              let obj_api = {};
              data.forEach((el2) => {
                obj_api = Object.assign(obj_api, { [el2.name]: el2.value });
              });

              const arr_result = {
                ...el,
                ...obj_api,
                sup_name: el.sup_name ? el.sup_name : "",
                urgency: obj_api["ความเร่งด่วน"] ? obj_api["ความเร่งด่วน"] : "",
                usage_date: obj_api["วันที่ต้องการใช้งาน"]
                  ? obj_api["วันที่ต้องการใช้งาน"]
                  : "",
                type_desired: obj_api["ประเภทที่ต้องการ"]
                  ? obj_api["ประเภทที่ต้องการ"].join(", ")
                  : "",
                accessory_hw: obj_api["อุปกรณ์ที่ต้องการเบิก-HW"]
                  ? obj_api["อุปกรณ์ที่ต้องการเบิก-HW"].join(", ")
                  : "",
                request_contact: obj_api["ผู้ที่จะให้ไอทีติดต่อกลับ"]
                  ? obj_api["ผู้ที่จะให้ไอทีติดต่อกลับ"].join("")
                  : "",
              };

              if (!arr_result.request_id.includes(request_no)) {
                return;
              }
              if (!arr_result.status_approval.includes(status)) {
                return;
              }
              if (!arr_result.lark_name.includes(requesters_name)) {
                return;
              }
              if (!arr_result.sup_name.includes(department_sup)) {
                return;
              }
              if (urgency) {
                const keyword = option_urgency.find(
                  (ele) => ele.value == urgency
                );
                if (!arr_result.urgency.includes(keyword.label)) {
                  return;
                }
              }
              // if (usage_startdate && usage_enddate) {
              //   const usage_date = moment(arr_result.usage_date);
              //   const usage_sd = moment(usage_startdate).add(7, "hours");
              //   const usage_ed = moment(usage_enddate).add(7, "hours");
              //   if (!usage_date.isBetween(usage_sd, usage_ed)) {
              //     return;
              //   }
              // }
              if (
                type_desired &&
                !arr_result.type_desired.includes(type_desired)
              ) {
                return;
              }
              if (
                accessory_hw &&
                !arr_result.accessory_hw.includes(accessory_hw)
              ) {
                return;
              }

              let comment = await taskItModel
                .selectRemarkComment({ ApproveID: arr_result.request_id })
                .orderBy("No", "desc");
              comment = comment[0];

              // if (duedate_start && duedate_end) {
              //   if (comment) {
              //     const duedate = moment(comment.Duedate);
              //     const duedate_sd = moment(duedate_start).add(7, "hours");
              //     const duedate_ed = moment(duedate_end).add(7, "hours");
              //     if (duedate.isBetween(duedate_sd, duedate_ed)) {
              //       return;
              //     }
              //   } else {
              //     return;
              //   }
              // }
              if (it_comment) {
                if (!(comment && comment.ItComment.includes(it_comment))) {
                  return;
                }
              }
              if (it_followup) {
                if (!(comment && comment.ItFollowUp.includes(it_followup))) {
                  return;
                }
              }
              if (pr_ep) {
                if (!(comment && comment.PrEp.includes(pr_ep))) {
                  return;
                }
              }

              const user_contact = await taskItModel.getUserMaster({
                LarkID: arr_result.request_contact,
              });

              const resultInstanceCode = await POST_LARK(
                "DETAIL_INSTANCE",
                { instance_code: el.instance_code, locale: "en-US" },
                lark_token
              );

              let timeline = [];
              if (resultInstanceCode && !resultInstanceCode.code) {
                const { comment_list, timeline: tl } = resultInstanceCode.data;
                const arr = tl.concat(
                  comment_list.map((el) => ({ ...el, type: "COMMENT" }))
                );
                arr.sort((a, b) => a.create_time - b.create_time);
                for (const val of arr) {
                  if (val.user_id) {
                    const user = await onGetUserDetail({
                      lark_id: val.user_id,
                    });
                    const { name } = user;
                    const { comment } = val;
                    timeline.push(
                      `${name}|${convertStatusTimeLine(val.type)}${
                        comment ? '|"' + comment + '"' : ""
                      }|${moment
                        .unix(val.create_time / 1000)
                        .format("YYYY-MM-DD HH:mm")}`
                    );
                  }
                }
              }

              return {
                request_no: arr_result.request_id,
                instance_code: arr_result.instance_code,
                status: arr_result.status_approval,
                submit_time: arr_result.start_date,
                requesters_name: arr_result.lark_name,
                department_sup: arr_result.sup_name,
                approval_records:
                  timeline.length > 0 ? timeline.join(", ") : "",
                current_approver:
                  timeline.length > 0 ? timeline[timeline.length - 1] : "",
                urgency: arr_result["ความเร่งด่วน"]
                  ? arr_result["ความเร่งด่วน"]
                  : "",
                usage_date: arr_result["วันที่ต้องการใช้งาน"]
                  ? arr_result["วันที่ต้องการใช้งาน"]
                  : "",
                type_desired: arr_result["ประเภทที่ต้องการ"]
                  ? arr_result["ประเภทที่ต้องการ"].join(", ")
                  : "",
                accessory_hw: arr_result["อุปกรณ์ที่ต้องการเบิก-HW"]
                  ? arr_result["อุปกรณ์ที่ต้องการเบิก-HW"].join(", ")
                  : "",
                quantity: arr_result["จำนวนชิ้น"]
                  ? arr_result["จำนวนชิ้น"]
                  : "",
                accessory_sw: arr_result["อุปกรณ์ที่ต้องการเบิก-SW"]
                  ? arr_result["อุปกรณ์ที่ต้องการเบิก-SW"].join(", ")
                  : "",
                system_license: arr_result["สิทธิการใช้งานระบบ"]
                  ? arr_result["สิทธิการใช้งานระบบ"].join(", ")
                  : "",
                system_import_export: arr_result["system import-Export"]
                  ? arr_result["system import-Export"].join(", ")
                  : "",
                detail_requested: arr_result["รายละเอียดอุปกรณ์ที่ขอเบิก"]
                  ? arr_result["รายละเอียดอุปกรณ์ที่ขอเบิก"]
                  : "",
                request_image: arr_result["แนบรูปรายละเอียด(ถ้ามี)"]
                  ? arr_result["แนบรูปรายละเอียด(ถ้ามี)"]
                  : "",
                // request_image: ["https://lf16-muse-va.ibytedtos.com/obj/lark-approval-attachment-va/image/20211213/6816262737870454790/984c3c75-c0db-4516-adf2-475c969bacdd.jpg",
                //     "https://sf16-muse-va.ibytedtos.com/obj/lark-approval-attachment-va/image/20211213/6816262737870454790/82c99118-deb3-45a8-bad9-e9824f7ab57e.jpg",
                //     "https://lf16-muse-va.ibytedtos.com/obj/lark-approval-attachment-va/image/20211213/6816262737870454790/d89a62c8-457f-46b3-ae19-d5c08b790699.jpg"],
                request_filedetail: arr_result["แนบไฟล์รายละเอียด(ถ้ามี)"]
                  ? arr_result["แนบไฟล์รายละเอียด(ถ้ามี)"]
                  : "",
                request_contact:
                  user_contact.length > 0 ? user_contact[0].EnName : "",
                remark: arr_result["หมายเหตุ"] ? arr_result["หมายเหตุ"] : "",
                duedate: comment ? comment.Duedate : "",
                it_followup: comment ? comment.ITLabel : "",
                it_comment: comment ? comment.ItComment : "",
                pr_ep: comment ? comment.PrEp : "",
              };
            }
          } catch (error) {
            return null;
          }
        })
      );

      result = result.filter((n) => n);
      success(res, "ดึงตาราง case task สำเร็จ", result);
    } catch (error) {
      failed(req, res, "ดึงตาราง case task ไม่สำเร็จ", error);
    }
  }

  async insertComment(req, res) {
    const { approve_no, duedate, it_follow_up, it_comment, pr_ep, it_label } =
      req.body;
    try {
      let query_comment = await taskItModel
        .selectRemarkComment({ ApproveID: approve_no })
        .orderBy("No", "desc");
      let count_no = 1;
      if (Array.isArray(query_comment) && query_comment.length > 0) {
        count_no = query_comment[0].No + 1;
      }
      const obj = {
        ApproveID: approve_no,
        No: count_no,
        Duedate: duedate,
        ItFollowUp: it_follow_up,
        ItComment: it_comment,
        PrEp: pr_ep,
        ITLabel: it_label,
      };
      const result = await taskItModel.insertRemarkComment(obj);
      success(res, "เพิ่ม comment task สำเร็จ", result);
    } catch (error) {
      failed(req, res, "เพิ่ม comment task ไม่สำเร็จ", error);
    }
  }
  async insertSaveComment(req, res) {
    const {
      approve_no,
      duedate,
      it_follow_up,
      it_comment,
      pr_ep,
      it_label,
      instance_code,
    } = req.body;
    try {
      let query_comment = await taskItModel
        .selectRemarkComment({ ApproveID: approve_no })
        .orderBy("No", "desc");
      let count_no = 1;
      if (Array.isArray(query_comment) && query_comment.length > 0) {
        count_no = query_comment[0].No + 1;
      }
      const obj = {
        ApproveID: approve_no,
        No: count_no,
        Duedate: duedate,
        ItFollowUp: it_follow_up,
        ItComment: it_comment,
        PrEp: pr_ep,
        ITLabel: it_label,
      };

      await taskItModel.insertRemarkComment(obj);

      const larkbody = {
        instance_code: instance_code,
        content: {
          text: it_comment,
        },
        mentioned_member_list: [],
        user_id: it_follow_up,
      };

      await POST_LARK_V2("COMMENT", larkbody);
      success(res, "เพิ่ม comment task สำเร็จ");
    } catch (error) {
      failed(req, res, "เพิ่ม comment task ไม่สำเร็จ", error);
    }
  }
  async insertSaveCommentGroup(req, res) {
    const {
      approve_no,
      duedate,
      it_follow_up,
      it_comment,
      pr_ep,
      it_label,
      instance_code,
      department_sup,
      requester_name,
    } = req.body;
    try {
      const groupData = await GET_LARK("GROUP");

      const group_names = groupData.data.result.map((e) => e.group_name);

      if (group_names.includes(`Group Approval ID: ${approve_no}`)) {
        const group_id = groupData.data.result.find(
          (e) => e.group_name === `Group Approval ID: ${approve_no}`
        ).group_id;

        const obj1 = {
          group_id: group_id,
          member_list: [it_follow_up],
        };

        await POST_LARK_V2("INVITE", obj1);
        const bodymsg = {
          group_id: group_id,
          msg_type: "text",
          content: {
            text: it_comment,
          },
        };

        // send message

        await POST_LARK_V2("MASSAGE_GROUP", bodymsg);

        // save part
        let query_comment = await taskItModel
          .selectRemarkComment({ ApproveID: approve_no })
          .orderBy("No", "desc");
        let count_no = 1;
        if (Array.isArray(query_comment) && query_comment.length > 0) {
          count_no = query_comment[0].No + 1;
        }

        const obj = {
          ApproveID: approve_no,
          No: count_no,
          Duedate: duedate,
          ItFollowUp: it_follow_up,
          ItComment: it_comment,
          PrEp: pr_ep,
          ITLabel: it_label,
        };
        const result = await taskItModel.insertRemarkComment(obj);

        // comment part
        const larkbody = {
          instance_code: instance_code,
          content: {
            text: it_comment,
          },
          mentioned_member_list: [],
          user_id: it_follow_up,
        };

        await POST_LARK_V2("COMMENT", larkbody);
        return success(res, "เพิ่ม comment task สำเร็จ");
      }

      // save part
      let query_comment = await taskItModel
        .selectRemarkComment({ ApproveID: approve_no })
        .orderBy("No", "desc");
      let count_no = 1;
      if (Array.isArray(query_comment) && query_comment.length > 0) {
        count_no = query_comment[0].No + 1;
      }

      const obj = {
        ApproveID: approve_no,
        No: count_no,
        Duedate: duedate,
        ItFollowUp: it_follow_up,
        ItComment: it_comment,
        PrEp: pr_ep,
        ITLabel: it_label,
      };
      await taskItModel.insertRemarkComment(obj);

      // comment part
      const larkbody = {
        instance_code: instance_code,
        content: {
          text: it_comment,
        },
        mentioned_member_list: [],
        user_id: it_follow_up,
      };

      await POST_LARK_V2("COMMENT", larkbody);

      //create group part

      const depData = await taskItModel.getUserMaster({
        EnName: department_sup,
      });
      const reqData = await taskItModel.getUserMaster({
        EnName: requester_name,
      });

      const dep_id = depData.map((res) => res.UserID);
      const requester_id = reqData.map((res) => res.UserID);

      const body = {
        name: `Group Approval ID: ${approve_no}`,
        description: `Group Approval ID: ${approve_no}`,
        owner: dep_id.toString(), // ZT54020 ของพี่จิ dep sup
        member_list: [it_follow_up, requester_id], // requester , itfollowup
        chat_type: "private",
      };

      // create group
      const res_group = await POST_LARK_V2("CREATE_GROUP", body);
      const bodymsg = {
        group_id: res_group.result.group_id,
        msg_type: "text",
        content: {
          text: it_comment,
        },
      };

      await POST_LARK_V2("MASSAGE_GROUP", bodymsg);

      success(res, "เพิ่ม comment task สำเร็จ");
    } catch (error) {
      failed(req, res, "เพิ่ม comment task ไม่สำเร็จ", error);
    }
  }
  async getCommentByReqId(req, res) {
    const { request_id } = req.query;
    try {
      let comment = await taskItModel.selectRemarkComment({
        ApproveID: request_id,
      });
      success(res, "ดึง comment task สำเร็จ", comment);
    } catch (error) {
      failed(req, res, "เพิ่ม comment task ไม่สำเร็จ", error);
    }
  }

  async getOptionSearch(req, res) {
    try {
      const query_it = await taskItModel.selectUserIt({});
      const query_req = await taskItModel.onGetReport({
        submit_sd: "",
        submit_ed: "",
      });
      if (!query_req || query_req.length <= 0) {
        return success(res, "ดึงข้อมูลสำเร็จ", { url: "" });
      }

      const urls = query_req.map((e) => e.form_path);

      let accessory_hw = [];
      let accessory_sw = [];
      let type_desired = [];
      await Promise.all(
        urls.map(async (el) => {
          const get_data = (await GET(el)).data;
          const ac_hw = get_data.find(
            (item) => item.name == "อุปกรณ์ที่ต้องการเบิก-HW"
          );
          const ac_sw = get_data.find(
            (item) => item.name == "อุปกรณ์ที่ต้องการเบิก-SW"
          );
          const ty_de = get_data.find(
            (item) => item.name == "ประเภทที่ต้องการ"
          );
          if (ac_hw) accessory_hw.push(ac_hw.option.map((el2) => el2.text));
          if (ac_sw) accessory_sw.push(ac_sw.option.map((el2) => el2.text));
          if (ty_de) type_desired.push(ty_de.option.map((el2) => el2.text));
        })
      );
      accessory_hw = [
        ...new Set(accessory_hw.reduce((prev, cur) => prev.concat(cur), [])),
      ].map((el) => ({
        value: el,
        label: el,
      }));
      accessory_sw = [
        ...new Set(accessory_sw.reduce((prev, cur) => prev.concat(cur), [])),
      ].map((el) => ({
        value: el,
        label: el,
      }));
      type_desired = [
        ...new Set(type_desired.reduce((prev, cur) => prev.concat(cur), [])),
      ].map((el) => ({
        value: el,
        label: el,
      }));
      const result = {
        type_desired,
        accessory_hw,
        accessory_sw,
        option_station,
        option_urgency,
        user_follow_it: query_it,
      };
      success(res, "ดึงตัวเลือก search สำเร็จ", result);
    } catch (error) {
      failed(req, res, "ดึงตัวเลือก search ไม่สำเร็จ", error);
    }
  }
}

module.exports = new taskItController();
