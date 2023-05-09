const authenRouter = (require('express'))['Router']()
const { success, failed } = require('../../config/response.js');
const authenController = require('./authenController.js')

authenRouter.get('/', (req, res) => failed(req, res, 'ดึงข้อมูลสำเร็จ'));

authenRouter.get('/login',
    authenController.onAuthen
)

authenRouter.post('/onHandleTokenWebLark',
    authenController.onHandleTokenWebLark
)

module.exports = authenRouter;