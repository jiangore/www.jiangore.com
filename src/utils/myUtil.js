
//https://blog.csdn.net/sinat_35670989/article/details/78224214
const crypto = require('crypto');
const lodash = require('lodash');
const moment = require('moment');
const urlEncode = require('urlencode');

const numbers = '0123456789';
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const specials = '~!@#$%^*()_+-=[]{}|;:,./<>?';

/**
 * 随机数
 * @param length
 * @param options
 * @returns {string}
 */
let random = (length, options) => {
    length || (length = 8);
    options || (options = {});

    var chars = '';
    var result = '';

    if (options === true) {
        chars = numbers + letters + specials;
    } else if (typeof options == 'string') {
        chars = options;
    } else {
        if (options.numbers !== false) {
            chars += (typeof options.numbers == 'string') ? options.numbers : numbers;
        }

        if (options.letters !== false) {
            chars += (typeof options.letters == 'string') ? options.letters : letters;
        }

        if (options.specials) {
            chars += (typeof options.specials == 'string') ? options.specials : specials;
        }
    }

    while (length > 0) {
        length--;
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
};

/**
 * 字符串不为空
 * @param str
 * @returns {boolean}
 */
let isNotEmpty = (str) => {
    if(str != '' && str != 'undefined' && str != null) {
        return true;
    } else {
        return false;
    }
};

/**
 * 字符串为空
 * @param str
 * @returns {boolean}
 */
let isEmpty = (str) => {
    return !isNotEmpty(str);
};


module.exports = {
    isNotEmpty(str) {
        if(str != '' && str != 'undefined' && str != null) {
            return true;
        } else {
            return false;
        }
    },
    isEmpty(str) {
        return !this.isNotEmpty(str);
    },
    isNumber(val) {
        return (!isNaN(val) && typeof val === 'number');
    },
    isEmail(email) {
        let pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return pattern.test(email);
    },
    isMobile(mobile) {
        let pattern = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        return pattern.test(mobile);
    },
    isQQ(QQ) {
        let pattern = /^[1-9][0-9]{4,10}$/;
        return pattern.test(QQ);
    },
    echo(str) {
        console.log('----------------start-----------------');
        console.log(str);
        console.log('-----------------end------------------');
    },
    now() {
        return new Date().getTime();
    },
    token() {
        return this.md5(this.now()+''+random(16));
    },
    rand(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },
    md5(str) {
        let md5 = crypto.createHash('md5');
        md5.update(str);
        return md5.digest('hex');
    },
    pwd(password, salt = '', multi = true) {
        if (salt) {
            if (multi) {
                let newPwd = password + salt;
                for (let i=0; i < salt.length; i++) {
                    newPwd = this.md5(newPwd);
                }
                return newPwd;
            }
            return this.md5(password + salt);
        }
        return this.md5(password);
    },
    compare(inputPassword, dbPassword, salt = '', multi = true) {
        let pwd = this.pwd(inputPassword, salt, multi);
        if (dbPassword == pwd) {
            return true;
        } else {
            return false;
        }
    },
    salt(num) {
        if (this.isNumber(num) && num >= 4) {
            return random(num);
        } else {
            return random(this.rand(4, 8));
        }
    }
};
