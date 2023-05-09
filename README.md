# Backend-Policy
    Policy for develop at Zettasoft Dev
สร้าง .env
```
    NODE_ENV=develop
    PORT=7000
    SIGN=GFKHFLHKT
    IP=http://localhost
    PREFIX=local
```

# NODE_ENV 
    หลักๆ มี 2 ส่วน 
1. develop
2. production 
เมื่อทำการ deploy ขึ้นเซิฟจะต้องสรา้ง service บนเซิฟแบ่งเป็น 2 ส่วนคือ PORT dev และ PORT production

# Log Description 
1.ใช้เก็บ error ในกรณีที่การทำงานของ API เกิด error และวิ่งเข้า catch
2.กำหนด ให้ log เขียนเมื่อระบบเป็น branch = production เท่านั้น

# How to Create Log error
(หรือสามารถเข้าไปดูที่ template backend node js ของนิสได้อยู่แล้วในส่วนนี้ config>>debug.js)
```js
exports.err = (message, url) => {
    if (process.env.NODE_ENV === 'production') {
        const logger = winston.createLogger({
            level: 'error',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', `${dayjs().format('YYYY-MM-DD')}-error.log`), level: 'error' })
            ]
        })
        return logger.error(`${dayjs().format('HH:mm:ss')} ${url || ''} => ${message}`);
    } else {
        _error('error with message %o', message)
    }
};
```
# How to use Log error 
ประกาศในทุกส่วนของ catch 
```js
const { err } = require('../../config/debug')
 try {
            console.log(object)
            success(res, 'success');
        } catch (error) {
         
            err(error, req.originalUrl)
   
        }
```

# Line noti Description
1.ใช้  Alert แจ้งเตือน error ไปที่ line 
2.ช่วยให้ในช่วงเริ่มต้นของการขึ้นระบบทำให้ทีม dev สามารถ monitor bug ที่เกิดขึ้นและพร้อมเข้าแก้ไขได้รวดเร็วที่สุด

# How to create Line noti
- create group line By Project name
- open https://notify-bot.line.me/my/
- login line
- generate token
- place token in bearer
- create folder service >> index.js

```js
const request = require('request-promise')
const FormData = require('form-data')


const LINE_NOTI = async (message) => {
    let formdata = new FormData();
    formdata.append("message", message);

    return request.post({
        uri: 'https://notify-api.line.me/api/notify',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        auth: {
            'bearer': 'token'///// place token from web
        },
        form: { message }
    })
}
module.exports = {
    LINE_NOTI
};


```

# How to use Line noti
ใส่ไว้ในส่วนของ catch 
```js
    const { LINE_NOTI } = require('../../service')
 try {
            console.log(object)
            success(res, 'success');
        } catch (error) {
         
            await LINE_NOTI(`${req.originalUrl} have error  ${error} `)
   
        }
```




