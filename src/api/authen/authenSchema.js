const Joi = require('joi');


const schemaLogin = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required(),
})

module.exports = {
    schemaLogin
}