const authenModel = require('./authenModel.js')
const { success, failed } = require('../../config/response')
const { env } = require('../../env.js')
const { POST_LARK } = require('../../helpers/lark.js')
const fs = require('fs')
const path = require('path')
const { decryptedData } = require('../../functions/encrypts.js');
const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');

class authenController {
    async onAuthen(req, res, next) {
        try {
            const { is_next } = req;
            const body = {
                app_id: env.lark.app_id,
                app_secret: env.lark.app_secret
            }

            const result = await POST_LARK('AUTHEN', body);
            if (!result || result.code) {
                return failed(req, res, 'เข้าสู่ระบบ Lark ไม่สำเร็จ', result)
            }

            const access_token = result.app_access_token;
            if (is_next) {
                req.lark_token = access_token;
                return next();
            }

            success(res, 'เข้าสู่ระบบ Lark สำเร็จ', { lark_token: access_token })
        } catch (error) {
            failed(req, res, 'เข้าสู่ระบบ Lark ไม่สำเร็จ', error)
        }
    }

    async onHandleTokenWebLark(req, res) {
        try {
            const { auth } = req.body;
            const privKey = fs.readFileSync(path.join(__dirname + '../../../../public/key/auth/privateKey.pem'), 'utf-8');
            const d = decryptedData(privKey, auth);
            if (d && !d.success) {
                return failed(req, res, 'ไม่สามารถถอดรหัสได้ เข้าสู้ระบบไม่สำเร็จ')
            }
            const query = (await authenModel.onLoginGoogle({ dplus_id: d.dplus_id }))[0];
            if (!query) {
                return failed(req, res, 'เข้าสู่ระบบไม่สำเร็จ');
            }

            const login_date = moment().format('YYYY-MM-DD HH:mm:ss');
            const { dplus_id } = query;
            const objToken = { dplus_id, login_date }
            const privateKey = fs.readFileSync(path.join(__dirname, '../../../public/key/sign/privateKey.pem'));
            const access_token = jsonwebtoken.sign(objToken, privateKey, { algorithm: 'RS256', expiresIn: '150d' });
            success(res, 'เข้าสู่ระบบสำเร็จ', { access_token })
        } catch (error) {
            failed(req, res, 'เข้าสู่ระบบไม่สำเร็จ', error)
        }
    }
}

module.exports = new authenController()