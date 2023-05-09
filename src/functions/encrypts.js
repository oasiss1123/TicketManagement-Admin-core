const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

exports.encrypt = function (toEncrypt) {
    try {
        const publicKey = fs.readFileSync(path.join(__dirname + '../../../public/key/publicKey.pem'), 'utf-8');
        const buffer = Buffer.from(toEncrypt);
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    } catch (error) {
        return ''
    }
};

exports.decrypt = function (toDecrypt) {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname + '../../../public/key/privateKey.pem'), 'utf-8');
        const buffer = Buffer.from(toDecrypt, "base64");
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
        return { success: true, ...JSON.parse(decrypted.toString("utf8")) };
    } catch (error) {
        return { success: false }
    }
};

exports.decryptedData = (privateKey, toDecrypt) => {
    try {
        const buffer = Buffer.from(toDecrypt, "base64");
        const decrypted = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        }, buffer);
        return { success: true, ...JSON.parse(decrypted.toString("utf8")) };
    } catch (error) {
        console.log(error)
        return { success: false }
    }
};