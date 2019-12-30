const path = require('path');
const uPath = require('upath');

/**
 * 目录部分
 */
let rootDir = uPath.join(__dirname, '../');
let configDir = uPath.join(__dirname, '../config');
let viewDir = uPath.join(__dirname, '../views');
let logDir = uPath.join(__dirname, '../temp/logs');
let cacheDir = uPath.join(__dirname, '../temp/cache');
let dataDir = uPath.join(__dirname, '../temp/data');
let dbDir = uPath.join(__dirname, '../temp/db');
let publicDir = uPath.join(__dirname, '../public');
let assetsDir = uPath.join(__dirname, '../public/assets');
let staticDir = uPath.join(__dirname, '../public/static');
let uploadDir = uPath.join(__dirname, '../public/upload');

let env = 'production';

/**
 * 微信参数配置
 * @returns {{appid: string, appsecret: string, checkSignature: boolean, token: string}|{appid: string, appsecret: string, checkSignature: boolean, token: string, encodingAESKey: string}}
 */
let wxConfig = (env) => {
    if (env === 'production') {
        return {
            token: process.env.WX_TOKEN,
            appid: process.env.WX_APPID,
            appsecret: process.env.WX_APPSECRET,
            encodingAESKey: process.env.WX_ENCODINGAESKEY,
            checkSignature: true,
        };
    } else {
        return {
            appid: "wxfda049f90ac6b5f4",
            appsecret: "f205f912a393cc2fe54d5c102a3c8a51",
            token: "dandelionNote",
            //由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
            checkSignature: false,
        }
    }
};

/**
 * MySQL配置
 * @returns {{password: string, database: string, dialect: string, port: number, timezone: string, host: string, username: string}|{dialect: string, storage: string}|{password: string, database: string, dialect: string, port: string, timezone: string, host: string, use_env_variable: string, username: string}}
 */
let dbConfig = (env) => {
    if (env === 'production') {
        return {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            dialect: 'mysql',
            timezone: '+08:00',
            use_env_variable: 'DB_URL'
        };
    } else if (env === 'test') {
        return {
            dialect: 'sqlite',
            storage: ':memory:'
        }
    } else {
        return {
            host: "localhost",
            port: 3306,
            username: "root",
            password: "123456",
            database: "test_blog",
            dialect: "mysql",
            timezone: '+08:00'
        }
    }
};

/**
 * Redis配置
 * @returns {{password: string, database: string, port: string, host: string}|{password: string, database: number, port: number, host: string}}
 */
let redisConfig = (env) => {
    if (env === 'production') {
        return {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            database: process.env.REDIS_DATABASE
        };
    } else {
        return {
            host: "127.0.0.1",
            port: 6379,
            password: "",
            database: 0
        }
    }
};


module.exports = {
    root: rootDir,
    config: configDir,
    view: viewDir,
    log: logDir,
    cache: cacheDir,
    data: dataDir,
    database: dbDir,
    public: publicDir,
    assets: assetsDir,
    static: staticDir,
    upload: uploadDir,
    wxConfig: wxConfig(env),
    dbConfig: dbConfig(env),
    redisConfig: redisConfig(env)
};