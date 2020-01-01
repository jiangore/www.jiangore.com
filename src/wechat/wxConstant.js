/**
 * 微信公众号各种场景
 */

module.exports = {

    //小冰场景代码
    CHAT_ROBOT_SCENE_CODE: 1002,

    //测颜值场景代码
    FACE_VALUE_SCENE_CODE: 1003,
    //测颜值结果 redis key 前缀
    FACE_VALUE_REDIS_PREFIX: 'wx:faceValue:rs:',
    //测颜值结果 redis 保留10天
    FACE_VALUE_REDIS_EXPIRE: 8640000,

    // 一言场景代码
    MOTTO_SCENE_CODE: 1010,
};