require("../config_env");

const { getOsEnv } = require("./lib/env/utils");
(async () => {
  const { promisify } = require("util");
  const fs = require("fs");
  const writeFile = promisify(fs.writeFile);
  const appendFile = promisify(fs.appendFile);

  await writeFile(".env.default", "## DEAFULT .env ##\n");
  const file = await fs.readFileSync(".env", "utf-8");
  const split = file.split("\n");
  for (const val of split) {
    await appendFile(".env.default", `\n${val.replace(/=.*/g, "=xxx")}`);
  }
})();

const lark = {
  production: {
    token: getOsEnv("LARK_TOKEN_PRD"),
    validate_key: getOsEnv("LARK_VALIDATE_KEY_PRD"),
    app_id: getOsEnv("LARK_APP_ID_PRD"),
    app_secret: getOsEnv("LARK_APP_SECRET_PRD"),
  },
  development: {
    token: getOsEnv("LARK_TOKEN"),
    validate_key: getOsEnv("LARK_VALIDATE_KEY"),
    app_id: getOsEnv("LARK_APP_ID"),
    app_secret: getOsEnv("LARK_APP_SECRET"),
  },
};

exports.env = {
  name: getOsEnv("APP_NAME"),
  sign: getOsEnv("SIGN"),
  node: process.env.NODE_ENV,
  port: process.env.EXPRESS_PORT,
  log: {
    level: getOsEnv("LOG_LEVEL"),
  },
  db: {
    prd: {
      host: getOsEnv("HOST_DATABASE"),
      username: getOsEnv("USERNAME_DATABASE"),
      password: getOsEnv("PASSWORD_DATABASE"),
      database: getOsEnv("LARK_CENTER_DATABASE_DEV"),
    },
    dev: {
      host: getOsEnv("DB62_SERVER_DEV"),
      username: getOsEnv("USERNAME_DATABASE_DEV"),
      password: getOsEnv("PASSWORD_DATABASE_DEV"),
      database: getOsEnv("LARK_CENTER_DATABASE_DEV"),
    },
  },
  saltround: getOsEnv("SALTROUND"),
  prefix: getOsEnv("PREFIX"),
  version_api: getOsEnv("VERSION_PATH"),
  lark_default: getOsEnv("URL_LARK_DEFUALT"),
  lark: {
    ...lark[process.env.NODE_ENV],
    token: getOsEnv("X-TOKEN"),
    apikey: getOsEnv("API_KEY"),
    authen: getOsEnv("LARK_AUTHEN"),
    create_approval: getOsEnv("LARK_CREATE_APPROVAL"),
    create_approval_cc: getOsEnv("LARK_CREATE_APPROVAL_CC"),
    subscript_approval: getOsEnv("LARK_SUBSCRIPT_APPROVAL"),
    unsubscript_approval: getOsEnv("LARK_UNSUBSCRIPT_APPROVAL"),
    webhook: getOsEnv("WEB_HOOK"),
    detail_instance: getOsEnv("LARK_DETAIL_INSTANCE"),
    upload: getOsEnv("LARK_UPLOAD_FILES"),
    send_message: getOsEnv("LARK_MESSAGE"),
    approval_detail: getOsEnv("LARK_DETAIL_APPROVAL"),
    contact_detail: getOsEnv("LARK_DETAIL_CONTACT"),
    bot_alert: getOsEnv("LARK_BOT_ALERT"),
    cancel: getOsEnv("LARK_APPROVAL_CANCEL"),
    comment: getOsEnv("LARK_COMMENT"),
    invite: getOsEnv("LARK_GROUP_INVITE"),
    msg_group: getOsEnv("LARK_MESSAGE_GROUP"),
    create_group: getOsEnv("LARK_CREATE_GROUP"),
    get_group: getOsEnv("LARK_GET_ALLGROUP"),
  },
};
