const { err } = require('./debug');

exports.success = (res, message, result = {}, code = 200) => {
    return res.status(code).json({ success: true, message, result })
}
exports.failed = (req, res, msg, error, code) => {
    err(error || msg, req.originalUrl);
    let obj = { success: false }
    if (typeof msg === 'string') {
        obj = { ...obj, message: msg }
    } else {
        const { message, ...utlis } = msg;
        obj = { ...obj, message: msg.message, result: utlis }
    }

    return res.status(code || 400).json(obj);
}
