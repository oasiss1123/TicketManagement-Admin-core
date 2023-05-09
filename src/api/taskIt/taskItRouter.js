const taskItRouter = (require('express'))['Router']()
const taskItController = require('./taskItController')
const authenController = require('../authen/authenController');
const { validateSchema } = require('../../middleware/validateSchema')
const { sch_getDataTaskIt, sch_insertComment, sch_getCommentByReqId,sch_insertSaveComment,sch_insertSaveCommentGroup } = require('./taskItSchema');
const { validateToken } = require('../../middleware/validateToken');


taskItRouter.post('/getDataTaskIt',
    // validateToken(),
    validateSchema([sch_getDataTaskIt]),
    (req, res, next) => {
        req.is_next = true;
        next();
    },
    authenController.onAuthen,
    taskItController.selectTaskIt
);

taskItRouter.post('/insertComment',
    // validateToken(),
    validateSchema([sch_insertComment]),
    taskItController.insertComment
);
taskItRouter.post('/insertSaveComment',
    // validateToken(),
    validateSchema([sch_insertSaveComment]),
    taskItController.insertSaveComment
);
taskItRouter.post('/insertSaveCommentGroup',
    // validateToken(),
    validateSchema([sch_insertSaveCommentGroup]),
    taskItController.insertSaveCommentGroup
);

taskItRouter.get('/getCommentByReqId',
    // validateToken(),
    validateSchema([sch_getCommentByReqId], 'query'),
    taskItController.getCommentByReqId
)

taskItRouter.get('/getOptionSearch',
    // validateToken(),
    taskItController.getOptionSearch
)

module.exports = taskItRouter;