let validator = require('validator')
let moment = require('moment');
moment.locale('zh-cn');

let Sequelize = require('sequelize');
let Op = Sequelize.Op;

let connection = require('../utils/dbUtil');

class User extends Sequelize.Model {

    constructor() {
        super();
    }

    //判断登录是 账号 邮箱 手机号码
    static loginField(username) {
        if (validator.isEmail(username)) {
            return {email: username};
        }
        if (validator.isMobilePhone(username)) {
            return {mobile: username};
        }
        return {username: username};
    };

    // 添加实例级别方法
    instanceLevelMethod() {
        return 'user';
    };
}
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        comment: 'ID'
    },
    username: {
        type: Sequelize.STRING(64),
        allowNull: false,
        comment: '账号'
    },
    nickname: {
        type: Sequelize.STRING(64)
    },
    password: {
        type: Sequelize.STRING(32),
        validate: {
            len: [6, 18]
        }
    },
    salt: {
        type: Sequelize.STRING(32),
        validate: {
            len: [4, 32]
        }
    },
    age: {
        type: Sequelize.TINYINT,
    },
    mobile: {
        type: Sequelize.STRING(11)
    },
    email: {
        type: Sequelize.STRING(64),
        validate: {
            isEmail: true
        }
    },
    register_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        comment: '注册时间',
        get() {
            return moment(this.getDataValue('register_time')).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    enable: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
        comment: '状态'
    }
}, {
    sequelize: connection,
    modelName: 'user',
    tableName: 't_user',
    comment: "用户表",
    //索引
    indexes: [
        {
            unique: true,
            fields: ['email', 'mobile']
        },
    ]
});
module.exports = User;