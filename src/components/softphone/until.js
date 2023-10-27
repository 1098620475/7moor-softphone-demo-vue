/*
 * @Author: Wangtao
 * @Date: 2023-06-08 11:24:27
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-18 23:27:46
 */
import JSEncrypt from 'jsencrypt/bin/jsencrypt';
import md5 from "js-md5";
import fetchJsonp from 'fetch-jsonp';
export var rsaPassword = function (secret, num, password) {
    var text = md5(password) + ":" + num;
    var jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(secret);
    var enc = jsEncrypt.encrypt(text);
    return enc;
};
export var MD5 = function (str) {
    return "" + md5(str);
};
export var getCurrentDateTime = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hour = date.getHours();
    var minites = date.getMinutes();
    var second = date.getSeconds();
    month = month + 1 > 9 ? month + 1 : '0' + (month + 1);
    day = day > 9 ? day : '0' + day;
    hour = hour > 9 ? hour : '0' + hour;
    minites = minites > 9 ? minites : '0' + minites;
    second = second > 9 ? second : '0' + second;
    return year + "-" + month + "-" + day + " " + hour + ":" + minites + ":" + second;
};
export var fetchByJsonpGet = function (data) {
    var url = data.url + '?json=' + encodeURIComponent(JSON.stringify(data.jsonData));
    var timeout = 15000;
    if (data.jsonData.Timeout !== undefined) {
        timeout = data.jsonData.Timeout;
    }
    return new Promise(function (resolve, reject) {
        fetchJsonp(url, {
            jsonpCallback: 'callbackName',
            timeout: timeout
        }).then(function (res) {
            var response = res.json();
            response.then(function (data) {
                console.log(data);
            });
            resolve(response);
        }).catch(function (res) {
            return reject(res); // 异常外抛即可，不用里面做相关的逻辑处理 eg:ctiWaitEvent
        });
    });
};
