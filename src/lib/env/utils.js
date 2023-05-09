exports.getOsEnv = (key) => {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }

    return process.env[key];
}

exports.getOsEnvOptional = (key) => {
    return process.env[key];
}

exports.toBool = (value) => {
    return value === 'true';
}