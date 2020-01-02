/**
 * 微信公众号各种场景
 */

module.exports = {

    // 小冰场景代码
    CHAT_ROBOT_SCENE_CODE: 1002,

    // 测颜值场景代码
    FACE_VALUE_SCENE_CODE: 1003,
    // 测颜值结果 redis key 前缀
    FACE_VALUE_REDIS_PREFIX: 'wx:testFaceValue:rs:',
    // 测颜值结果 redis 保留10天
    FACE_VALUE_REDIS_EXPIRE: 8640000,

    // 测CP场景代码
    COUPLE_SCENE_CODE: 1004,
    COUPLE_REDIS_PREFIX: 'wx:testCouple:rs:',
    COUPLE_REDIS_EXPIRE: 8640000,

    // 测穿衣场景代码
    DRESS_SCENE_CODE: 1008,
    DRESS_REDIS_PREFIX: 'wx:testDress:rs:',
    DRESS_REDIS_EXPIRE: 8640000,

    // 测作诗场景代码
    POEM_SCENE_CODE: 1009,
    POEM_REDIS_PREFIX: 'wx:testPoem:rs:',
    POEM_REDIS_EXPIRE: 8640000,


    // 音乐场景代码
    MUSIC_SCENE_CODE: 2001,

    // 一言场景代码
    MOTTO_SCENE_CODE: 2101,

    // 翻译场景代码
    TRANSLATE_SCENE_CODE: 2201,
};