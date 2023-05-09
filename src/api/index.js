const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { env } = require('../env');
const { validateToken } = require('../middleware/validateToken')

const prefix = env.prefix;
const version = env.version_api;

function appendPrefix(routeName) {
    return `/${prefix}${version}/${routeName}`
}

exports.createApi = async (app) => {
    // app.use(validateToken())
    const readdir = promisify(fs.readdir)
    const writeFile = promisify(fs.writeFile);
    const appendFile = promisify(fs.appendFile);

    const folders = (await readdir('./src/api')).filter(f => !f.includes('.'));
    await writeFile('./src/api/router.md', '## ROUTER ##')

    for (const e of folders) {
        const p = path.join(__dirname, `./${e}/${e}Router.js`);
        if (fs.existsSync(p)) {
            appendFile('./src/api/router.md', `\n \t${appendPrefix(e)}`);
            app.use(appendPrefix(e), require(`./${e}/${e}Router`));
        }
    }
}