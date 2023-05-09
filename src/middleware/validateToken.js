const jsonwebtoken = require('jsonwebtoken');
const { failed } = require('../config/response');
const { err, debug } = require('../config/debug');
const { getOriginPath } = require('../functions');
const { ignoreCheckToken } = require('../utils');
const { env } = require('../env');
const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const { decrypt } = require('../functions/encrypts');

exports.validateToken = () => {
    return async (req, res, next) => {
        /**
         * TODO CHECK AUTHORIZATION
         */

        const origin = getOriginPath(req.originalUrl);
        const checkIgnore = ignoreCheckToken.indexOf(origin) >= 0;
        if (checkIgnore) {
            return next();
        }

        if (req.headers && req.headers.authorization) {
            const de = decrypt(req.headers.authorization);
            if (de && !de.success) {
                try {
                    const publicKey = fs.readFileSync(path.join(__dirname, '../../public/key/sign/publicKey.pem'));
                    const verify = promisify(jsonwebtoken.verify);
                    const decode = await verify(req.headers.authorization, publicKey);
                    req.access_token = req.headers.authorization
                    req.dplus_id = decode.dplus_id
                    next()
                } catch (error) {
                    console.log(error)
                    failed(req, res, 'ไม่สามารถใช้งานระบบได้ กรุณาติดต่อ admin')
                }
                return
            }

            next()
        } else {
            err('token not found', req.originalUrl)
            failed(req, res, 'token not found')
        }
    }
}