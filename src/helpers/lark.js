const axios = require("axios");
const { env } = require("../env");

const URL_DEFALT_LARK = env.lark_default;

exports.MONITOR_LARK = async (message) => {
  const res = await axios(URL_DEFALT_LARK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      title: "มีเคสจ้า สนใจหนูหน่อย",
      text: message,
    }),
  });

  return res.data;
};

exports.POST_LARK = async (type, body, access_token) => {
  let URL = "";
  switch (type) {
    case "SUBSCRIPT_APPROVAL":
      URL = env.lark.subscript_approval;
      break;
    case "UNSUBSCRIPT_APPROVAL":
      URL = env.lark.unsubscript_approval;
      break;
    case "AUTHEN":
      URL = env.lark.authen;
      break;
    case "CREATE_APPROVAL":
      URL = env.lark.create_approval;
      break;
    case "CREATE_APPROVAL_CC":
      URL = env.lark.create_approval_cc;
      break;
    case "DETAIL_INSTANCE":
      URL = env.lark.detail_instance;
      break;
    case "UPLOAD_FILES":
      URL = env.lark.upload;
      break;
    case "SEND_MESSAGE":
      URL = env.lark.send_message;
      break;
    case "APPROVAL_DETAIL":
      URL = env.lark.approval_detail;
      break;
    case "CANCEL_APPROVAL":
      URL = env.lark.cancel;
      break;
    default:
      break;
  }
  const res = await axios(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body),
  });

  return res.data;
};

exports.POST_LARK = async (type, body, access_token) => {
  let URL = "";
  switch (type) {
    case "SUBSCRIPT_APPROVAL":
      URL = env.lark.subscript_approval;
      break;
    case "UNSUBSCRIPT_APPROVAL":
      URL = env.lark.unsubscript_approval;
      break;
    case "AUTHEN":
      URL = env.lark.authen;
      break;
    case "CREATE_APPROVAL":
      URL = env.lark.create_approval;
      break;
    case "CREATE_APPROVAL_CC":
      URL = env.lark.create_approval_cc;
      break;
    case "DETAIL_INSTANCE":
      URL = env.lark.detail_instance;
      break;
    case "UPLOAD_FILES":
      URL = env.lark.upload;
      break;
    case "SEND_MESSAGE":
      URL = env.lark.send_message;
      break;
    case "APPROVAL_DETAIL":
      URL = env.lark.approval_detail;
      break;
    case "CANCEL_APPROVAL":
      URL = env.lark.cancel;
      break;
    default:
      break;
  }
  const res = await axios(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body),
  });

  return res.data;
};

exports.POST_LARK_V2 = async (type, body) => {
  let URL = "";
  switch (type) {
    case "COMMENT":
      URL = env.lark.comment;
      break;
    case "INVITE":
      URL = env.lark.invite;
      break;
    case "MASSAGE_GROUP":
      URL = env.lark.msg_group;
      break;
    case "CREATE_GROUP":
      URL = env.lark.create_group;
      break;
    default:
      break;
  }
  const res = await axios(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.lark.token}`,
      apikey: `${env.lark.apikey}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body),
  });

  return res.data;
};

exports.GET_LARK = async (type) => {
  let URL = "";
  switch (type) {
    case "GROUP":
      URL = env.lark.get_group;

    default:
      break;
  }

  const res = await axios(URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.lark.token}`,
      ApiKey: `${env.lark.apikey}`,
      "Content-Type": "application/json",
    },
  });

  return res;
};
