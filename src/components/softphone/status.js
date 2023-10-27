import fetchJsonp from 'fetch-jsonp';
import { getCurrentDateTime } from './until';
var handleStatus = /** @class */ (function () {
    function handleStatus(options) {
        var _this = this;
        this.attachEventCallbacks = {
            success: handleStatus.noop,
            error: handleStatus.noop,
            message: handleStatus.noop
        };
        this.statusConfig = {};
        this.isGetJsonpStateProcess = false;
        this.attachEvent = (function (callbacks) {
            _this.attachEventCallbacks = callbacks;
        });
        this.handleEvent = function (evtJsons) {
            evtJsons.forEach(function (event) {
                _this.eventProcess(event);
            });
        };
        this.eventProcess = function (evtJson) {
            _this.attachEventCallbacks.message(evtJson);
        };
        this.initStatus(options);
    }
    handleStatus.prototype.initStatus = function (options) {
        var _this = this;
        this.fetchByJsonpGet({
            url: options.url,
            jsonData: {
                Command: 'Action',
                User: options.agentNumber,
                Action: 'GetWSSupport'
            }
        }).then(function (res) {
            if (res && res.Succeed) {
                // if (res.WS_PORT && ('WebSocket' in window || 'MozWebSocket' in window)) {
                //   this.RegisterByWs(options, res.WS_PORT, res.WS_SECURE_PORT)
                // }
                _this.RegisterByJsonp(options);
            }
        });
    };
    handleStatus.prototype.RegisterByWs = function (options, WS_PORT, WS_SECURE_PORT) {
        var _this = this;
        var that = this;
        var wsIp = options.url;
        var index = wsIp.indexOf('//');
        wsIp = wsIp.substring(index + 2, wsIp.length);
        if (wsIp.indexOf(':') > -1) { // 带着端口号的舍弃端口号
            wsIp = wsIp.split(':')[0];
        }
        if (wsIp.indexOf('/') > -1) { // 只取域名，xxx.com/aaa 去除aaa
            wsIp = wsIp.split('/')[0];
        }
        var url = 'ws://' + wsIp + ':' + WS_PORT + '/websocket';
        if (document.location.protocol === 'https:') {
            WS_SECURE_PORT = WS_SECURE_PORT ? WS_SECURE_PORT : '443';
            url = 'wss://' + wsIp + ':' + WS_SECURE_PORT + '/websocket';
        }
        var lockReconnect = false;
        var reconnectNum = 0;
        var kickFlag = false;
        var initWebsocket = function () {
            try {
                if ('WebSocket' in window) {
                    _this.ws = new WebSocket(url);
                }
                // else if ('MozWebSocket' in window) {
                //   this.ws = new MozWebSocket(url)
                // }
                connect.initConnect();
            }
            catch (e) {
                connect.reconnect();
                console.log(e);
            }
        };
        // ws 心跳检测
        var heartCheck = {
            timeout: 5000,
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function () {
                window.clearTimeout(this.timeoutObj);
                window.clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start: function () {
                var self = this;
                this.timeoutObj = window.setTimeout(function () {
                    // 这里发送一个心跳，后端收到后，返回一个心跳消息，
                    // onmessage拿到返回的心跳就说明连接正常
                    if (that.ws.readyState === 1) { // ws正常建立连接时才发ping
                        that.ws.send(JSON.stringify({ Action: 'Ping', SessionID: that.statusConfig.SessionID }));
                    }
                    self.serverTimeoutObj = window.setTimeout(function () {
                        that.ws.close(); // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    }, self.timeout * 8);
                }, this.timeout);
            }
        };
        var connect = {
            initConnect: function () {
                _this.ws.onclose = function () {
                    if (!kickFlag) { // 被踢出的情况，不能重连
                        connect.reconnect();
                    }
                    console.log('ws连接关闭!' + new Date().toUTCString());
                };
                _this.ws.onerror = function (event) {
                    if (reconnectNum > 4 && reconnectNum % 8 === 1) { // 连接服务器超时，可能是您的网络问题，正在尝试重新连接...
                    }
                    connect.reconnect();
                };
                that.ws.onopen = function () {
                    heartCheck.reset().start(); // 心跳检测重置
                    reconnectNum = 0;
                    var currentTime = getCurrentDateTime();
                    var isHideTel = false;
                    var sendData = {
                        ipMessage: options.ipMessage,
                        User: options.agentNumber,
                        Monitor: false,
                        ExtenType: options.loginType,
                        Command: 'Action',
                        Action: 'Login',
                        Password: options.password,
                        ActionID: 'Login' + Math.random(),
                        BusyType: options.busyType,
                        currentTime: currentTime,
                        AppVersion: 'service',
                        IsHideTel: isHideTel
                    };
                    console.log('登陆-----------------------------', sendData);
                    that.ws.send(JSON.stringify(sendData)); // 获取登陆信息
                };
                that.ws.onmessage = function (event) {
                    _this.attachEventCallbacks.success = (that.attachEventCallbacks.success && typeof that.attachEventCallbacks.success == "function") ? that.attachEventCallbacks.success : handleStatus.noop;
                    _this.attachEventCallbacks.error = (that.attachEventCallbacks.error && typeof that.attachEventCallbacks.error == "function") ? that.attachEventCallbacks.error : handleStatus.noop;
                    _this.attachEventCallbacks.message = (that.attachEventCallbacks.message && typeof that.attachEventCallbacks.message == "function") ? that.attachEventCallbacks.message : handleStatus.noop;
                    var eventData = JSON.parse(event.data);
                    if (!eventData.Pong && eventData.Response !== 'Ping') {
                        heartCheck.reset().start(); // 拿到任何消息都说明当前连接是正常的
                        if (eventData.Response === 'Login') { // 登陆事件
                            _this.LoginInfo = eventData;
                            if (eventData.UserID) {
                                _this.statusConfig.UserID = eventData.UserID;
                            }
                            if (eventData.SessionID) {
                                _this.statusConfig.SessionID = eventData.SessionID;
                            }
                            else if (!eventData.Succeed) {
                                var code = eventData.Result;
                                if (code) {
                                    if (code === 601) { // 通话座席登录数已达最大或者已经到期
                                    }
                                    else if (code === 603) { // 通话座席登录数已达最大或者已经到期,换登录方式
                                    }
                                    else if (code === 602) { // 通话座席登录数已达最大或者已经到期,换登录方式
                                    }
                                    else if (code === 500) {
                                    }
                                    else if (code === 406) { // 账号的版本与系统版本不符
                                    }
                                    else {
                                        if (code === '400') { // 登录失败
                                        }
                                    }
                                    ;
                                    options.fail({
                                        success: false,
                                        code: code,
                                        message: '初始化失败'
                                    });
                                }
                            }
                            return eventData;
                        }
                        else if (eventData.Response && eventData.Response.Response === 'PushState') {
                            if (eventData.Event[0] && eventData.Event[0].Event === 'Kick') {
                                if (eventData.Response && (eventData.Response.Comments === 'ekick' || eventData.Response.Comments === 'ukick')) { // 同时登录踢出
                                }
                                else if (eventData.Response && eventData.Response.Comments === 'restartKick') { // 客户正在使用系统时，状态服务器重启，6S后提示异常并且重连电话条
                                    return;
                                }
                                else { // 管理员强制签出
                                }
                                _this.eventProcess({
                                    Event: 'kick'
                                });
                                kickFlag = true;
                                that.ws.close();
                                return;
                            }
                            console.log(eventData.Event, 'event===========================data');
                            _this.handleEvent(eventData.Event);
                        }
                    }
                    else if (eventData.Pong && eventData.Response === 'Ping') {
                        heartCheck.reset().start(); // 拿到任何消息都说明当前连接是正常的
                    }
                };
            },
            reconnect: function () {
                if (lockReconnect) {
                    return;
                }
                lockReconnect = true;
                window.setTimeout(function () {
                    reconnectNum++;
                    initWebsocket();
                    lockReconnect = false;
                }, 2000);
            }
        };
        initWebsocket();
    };
    handleStatus.prototype.RegisterByJsonp = function (options) {
        var _this = this;
        var that = this;
        var url = options.url;
        var phoneJson = {
            Command: "Action",
            Action: "Login",
            ActionID: "Login" + Math.random(),
            ExtenType: options.loginType,
            Password: options.password,
            BusyType: options.busyType,
            Monitor: false,
            User: options.agentNumber,
            AppVersion: 'service'
        };
        // var onload = function(response: any) {
        //     var _response = response;
        //     //console.dir(_response);
        //     if (!_response.Succeed) {
        //         var code = _response.Result;
        //         if (code) {
        //             if (code == 601) {
        //             } else if (code == 603) {
        //             } else if (code == 602) {
        //             } else if(code == 500) {
        //             } else if(code == 406){
        //             }else {
        //                 if(code == '400'){
        //                 }
        //             }
        //         }
        //     } else if (_response.SessionID) {
        //         _cti_waitEvent();
        //     }
        // };
        // var onerror = function() {
        //     alert('请求超时，请检查本地网络');
        // };
        this.fetchByJsonpGet({
            url: url,
            jsonData: phoneJson
        }).then(function (response) {
            var _response = response;
            if (!_response.Succeed) {
                var code = _response.Result;
                if (code) {
                    if (code == 601) {
                    }
                    else if (code == 603) {
                    }
                    else if (code == 602) {
                    }
                    else if (code == 500) {
                    }
                    else if (code == 406) {
                    }
                    else {
                        if (code == '400') {
                        }
                    }
                    ;
                    options.fail({
                        success: false,
                        code: code,
                        message: '初始化失败'
                    });
                }
            }
            else if (_response.SessionID) {
                _this.statusConfig.SessionID = _response.SessionID;
                _this.statusConfig.UserID = _response.UserID;
                _this.LoginInfo = _response;
                options.success();
                that.getJsonpState(options);
            }
        }).catch(function () {
        });
    };
    handleStatus.prototype.getJsonpState = function (options) {
        var _this = this;
        var that = this;
        if (this.isGetJsonpStateProcess) {
            return;
        }
        this.isGetJsonpStateProcess = true;
        var phoneJson = {
            Command: "Action",
            Action: "GetState",
            ActionID: "GetState" + Math.random(),
            SessionID: that.statusConfig.SessionID,
            User: options.agentNumber
        };
        // var onload = function(response) {
        //     _cti_reconnection_count = 0;
        //     _cti_display("");
        //     if(!response)
        //         return;
        //     var datas = response;
        //     var _response = datas.Response;
        //     if (!_response)
        //         _response = datas;
        //     if (_response.Succeed && !_response.HasEvent) {
        //     } else if (!_response.Succeed) {
        //         if(_response.Expired) {
        //             _cti_relogin();
        //             _cti_is_waiting_event = false;
        //             return;
        //         }
        //     } else {
        //         if(_response.Kick) {
        //             var comments = "";
        //             session.kickOut = true
        //             if(_response.Comments)
        //                 comments = _response.Comments;
        //             if(comments == "ukick" || comments == "ekick") {
        //                 alert("您当前的会话已经失效,导致该问题的原因是别的座席使用相同的帐号（或相同的分机）登录了");
        //             }else if(comments == "restartKick"){
        //                 window.setTimeout(function(){
        //                     _cti_relogin();
        //                     _cti_display("网络异常！正在开始自动重连...");
        //                 }, 60000);
        //                 return;
        //             } else {
        //                 alert("您当前的会话已经失效,导致该问题的原因可能是被管理员强制签出");
        //             }
        //             _cti_is_waiting_event = false;
        //             session.logined = false;
        //             window.location='./';
        //             return;
        //         } else {
        //             var events = datas.Event;
        //             if(events != null) {
        //                 _cti_eventHandler(events, false);
        //             }
        //         }
        //     }
        //     _cti_is_waiting_event = false;
        //     _cti_waitEvent();
        // };
        // var onerror = function() {
        //     _cti_is_waiting_event = false;
        //     window.setTimeout(function() {
        //         _cti_reconnection_count++;
        //         if(_cti_reconnection_count > 3)
        //             _cti_display("连接服务器超时，可能是您的网络问题，正在尝试重新连接...");
        //         _cti_waitEvent();
        //     }, 1000);
        // };
        // _cti_sendAction(phoneJson, onload, onerror);
        this.fetchByJsonpGet({
            url: options.url,
            jsonData: phoneJson
        }).then(function (response) {
            if (!response)
                return;
            var datas = response;
            var _response = datas.Response;
            if (!_response)
                _response = datas;
            if (_response.Succeed && !_response.HasEvent) {
            }
            else if (!_response.Succeed) {
                if (_response.Expired) {
                    that.RegisterByJsonp(options);
                    _this.isGetJsonpStateProcess = false;
                    return;
                }
            }
            else {
                if (_response.Kick) {
                    var comments = "";
                    if (_response.Comments) {
                        comments = _response.Comments;
                    }
                    if (comments == "ukick" || comments == "ekick") {
                        // alert("您当前的会话已经失效,导致该问题的原因是别的座席使用相同的帐号（或相同的分机）登录了");
                        _this.eventProcess({
                            Event: 'kick'
                        });
                    }
                    else if (comments == "restartKick") {
                        window.setTimeout(function () {
                            that.RegisterByJsonp(options);
                        }, 60000);
                        return;
                    }
                    else {
                        _this.eventProcess({
                            Event: 'kick'
                        });
                        // alert("您当前的会话已经失效,导致该问题的原因可能是被管理员强制签出");
                    }
                    _this.isGetJsonpStateProcess = false;
                    return;
                }
                else {
                    var events = datas.Event;
                    if (events != null) {
                        _this.handleEvent(events);
                    }
                }
            }
            _this.isGetJsonpStateProcess = false;
            that.getJsonpState(options);
        });
    };
    handleStatus.prototype.fetchByJsonpGet = function (data) {
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
    handleStatus.noop = function () { };
    return handleStatus;
}());
export default handleStatus;
