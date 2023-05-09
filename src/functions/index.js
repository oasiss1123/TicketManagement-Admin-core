const _ = require('lodash')
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { env } = require('../env');
require('dotenv').config()

exports.getOriginPath = (originalUrl) => {
    let replace = originalUrl.replace(`${env.prefix}/api/v1/`, '');
    if (replace.includes('?')) {
        const length = replace.length;
        const str = replace;
        replace = '';
        for (let x = 0; x < length; x++) {
            if (str[x] === '?') {
                break;
            }
            replace += str[x];
        }
    }
    return replace;
}

exports.getCurrentDate = (format = 'YYYY-MM-DD') => {
    return moment().format(format)
}

exports.generateOTP = (length = 6) => {
    const _sym = '1234567890';
    const count = length;
    let str = '';

    for (let index = 0; index < count; index++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }
    return str;
}

exports.generateRef = (length = 6) => {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';

    let otp = '';

    for (let i = 1; i <= length; i++) {
        let index = Math.floor(Math.random() * (digits.length));
        otp = otp + digits[index];
    }

    return otp;
}

exports.getDiffDate = (start, end, type = 'hour') => {
    const a = moment(start);
    const b = moment(end);
    const diff = b.diff(a, type);
    return diff
}

exports.randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.removeKeyEmpty = (object) => {
    _.mapKeys(object, function (value, key) {
        if (typeof value === "object" && _.isEmpty(value)) {
            delete object[key];
        } else {
            if (!value) {
                delete object[key];
            }
        }
    });

    return object;
}

exports.convertObjectToMongoose = (prefix, obj) => {
    let setObject = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            setObject = {
                ...setObject,
                [`${prefix}.${key}`]: element
            }
        }
    }

    return setObject;
}

exports.convertObjectToProject = (prefix, array) => {
    let setObject = {};
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        setObject = {
            ...setObject,
            [element]: `${prefix}.${element}`
        }
    }
    return setObject;
}

exports.removeDupArray = (arr1, arr2, key) => {
    let arr = [];
    for (let index = 0; index < arr1.length; index++) {
        const element = arr1[index];
        const findIndex = arr2.findIndex(e => e[key] === element[key]);
        if (findIndex === -1) {
            arr = [...arr, element]
        }
    }

    return arr;
}

exports.unlinkFile = async (sourcePath, files = []) => {
    try {
        await Promise.all(files.map((f) => {
            const dir = path.join(__dirname, `../../public${sourcePath}/${f.filename}`);
            fs.unlink(dir, (error) => error && console.log(error));
            return true;
        }))
    } catch (error) {
        return []
    }
}

exports.convertMimeType = (mimetype = '') => {
    if (mimetype.includes('image')) {
        return 'image';
    }

    return mimetype;
}