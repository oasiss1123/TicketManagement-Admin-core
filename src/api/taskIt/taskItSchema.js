const Joi = require('joi');

exports.sch_getDataTaskIt = Joi.object().keys({
    request_no: Joi.string().required().allow('', null),
    status: Joi.string().required().allow('', null).valid('PENDING', 'APPROVED'),
    submit_sd: Joi.date().required().allow('', null),
    submit_ed: Joi.date().required().allow('', null),
    requesters_name: Joi.string().required().allow('', null),
    department_sup: Joi.string().required().allow('', null),
    urgency: Joi.string().required().allow('', null).valid('it_method', 'urgent'),
    usage_startdate: Joi.date().required().allow('', null),
    usage_enddate: Joi.date().required().allow('', null),
    type_desired: Joi.string().required().allow('', null),
    accessory_hw: Joi.string().required().allow('', null),
    duedate_start: Joi.date().required().allow('', null),
    duedate_end: Joi.date().required().allow('', null),
    it_comment: Joi.string().required().allow('', null),
    it_followup: Joi.string().required().allow('', null),
    pr_ep: Joi.string().required().allow('', null),
})

exports.sch_insertComment = Joi.object().keys({
    approve_no: Joi.string().required(),
    duedate: Joi.date().required().allow(null, ""),
    it_follow_up: Joi.string().required().allow(null, ""),
    it_comment: Joi.string().required().allow(null, ""),
    pr_ep: Joi.string().required().allow(null, ""),
    it_label: Joi.string().required().allow(null, ""),
})

exports.sch_insertSaveComment = Joi.object().keys({
    approve_no: Joi.string().required(),
    duedate: Joi.date().required().allow(null, ""),
    it_follow_up: Joi.string().required().allow(null, ""),
    it_comment: Joi.string().required().allow(null, ""),
    pr_ep: Joi.string().required().allow(null, ""),
    it_label: Joi.string().required().allow(null, ""),
    instance_code: Joi.string().required(),
})

exports.sch_insertSaveCommentGroup = Joi.object().keys({
    approve_no: Joi.string().required(),
    duedate: Joi.date().required().allow(null, ""),
    it_follow_up: Joi.string().required().allow(null, ""),
    it_comment: Joi.string().required().allow(null, ""),
    pr_ep: Joi.string().required().allow(null, ""),
    it_label: Joi.string().required().allow(null, ""),
    instance_code: Joi.string().required(),
    department_sup : Joi.string().required(),
    requester_name : Joi.string().required(),
})

exports.sch_getCommentByReqId = Joi.object().keys({
    request_id: Joi.string().required()
})
