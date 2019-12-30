/**
 * MySQL客户端
 */
let app_name = process.env.APP_NAME;
let echo = require('debug')(app_name+':mysql');

const Sequelize = require('sequelize');

const params = require('../params');
let config = params.dbConfig;

//数据库连接池的配置
config.pool = {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
};

//禁用日志记录或提供自定义日志记录功能；默认值：console.log
config.logging = false;

// 禁止将未定义的值插入为NULL  default: false
config.omitNull = true;

//全局配置，在模型中可覆盖，调用Sequelize.define时使用
config.define = {
    //不添加时间戳属性 (updatedAt, createdAt)
    timestamps: false,

    // 禁用修改表名; 默认情况下,sequelize将自动将所有传递的模型名称(define的第一个参数)转换为复数. 如果你不想这样,请设置以下内容
    freezeTableName: true,

    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time',
    charset: 'utf8',
    dialectOptions: {
        collate: 'utf8_general_ci'
    },

    // 将自动设置所有属性的字段参数为下划线命名方式.
    // 不会覆盖已经定义的字段选项
    underscored: false,

    //MySQL默认引擎
    engine: 'InnoDB',
};

//事物的隔离级别
config.isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;


//开始实例化客户端
let db = null;
if (config.use_env_variable) {
    db = new Sequelize(process.env[config.use_env_variable], config);
} else {
    db = new Sequelize(config.database, config.username, config.password, config);
}

echo('数据库[%o]配置完成', config.database);

db.authenticate()
    .then(() => {
        echo('Connection has been established successfully.');
    })
    .catch(err => {
        echo.log('Unable to connect to the database', err)
    });


// 根据 model自动创建表
/*
sequelize
    .sync()
    .then(() => {
        console.log('init db ok')
    })
    .catch(err => {
        console.log('init db error', err)
    });
*/

module.exports = db;