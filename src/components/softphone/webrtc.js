/*
 * @Author: Wangtao
 * @Date: 2023-06-16 15:31:04
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-06-16 17:44:01
 */
// @ts-ignore
import { Janus } from './janus';
var handleWebrtc = /** @class */ (function () {
    function handleWebrtc(options) {
        var _this = this;
        this.started = false;
        this._janus = null;
        this.sipcall = null;
        this.current_jsep = null;
        this.registered = false;
        this.reconnect_set_time_out = null;
        this.current_result = null;
        this.initWebSipPhone = function (media_server, media_username, media_authuser, media_pwd, media_dispalyname) {
            var that = _this;
            // Initialize the library (all console debuggers enabled)
            Janus.init({
                callback: function () {
                    // Use a button to start the demo
                    if (that.started) {
                        return;
                    }
                    that.started = true;
                    // Make sure the browser supports WebRTC
                    if (!Janus.isWebrtcSupported()) {
                        // alert("No WebRTC support... ")
                        return;
                    }
                    // Create session
                    that._janus = new Janus({
                        withCredentials: true,
                        server: 'https://janus-ykf.7moor.com/janus',
                        // withCredentials: true,
                        success: function () {
                            // Attach to echo test plugin
                            that._janus.attach({
                                plugin: "janus.plugin.sip",
                                opaqueId: "7moorSip-" + Janus.randomString(12),
                                success: function (pluginHandle) {
                                    // $('#details').remove();
                                    that.sipcall = pluginHandle;
                                    // m7WebPhone.initCallback(pluginHandle)
                                    Janus.log("Plugin attached! (" + that.sipcall.getPlugin() + ", id=" + that.sipcall.getId() + ")");
                                    // registerUsername(media_server, media_username, media_authuser, media_pwd, media_dispalyname);
                                },
                                error: function (error) {
                                    // alert('初始化软电话失败！');
                                    // Janus.error("  -- Error attaching plugin...", error);
                                    // bootbox.alert("  -- Error attaching plugin... " + error);
                                },
                                consentDialog: function (on) {
                                    Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                                },
                                onmessage: function (msg, jsep) {
                                    that.current_jsep = jsep;
                                    Janus.debug(" ::: Got a message :::");
                                    Janus.debug(msg);
                                    // Any error?
                                    var error = msg["error"];
                                    if (error != null && error != undefined) {
                                        if (!that.registered) {
                                        }
                                        else {
                                            // Reset status
                                            that.sipcall.hangup();
                                        }
                                        alert(error);
                                        return;
                                    }
                                    var result = msg["result"];
                                    that.current_result = result;
                                    if (result !== null && result !== undefined && result["event"] !== undefined && result["event"] !== null) {
                                        var event = result["event"];
                                        if (event === 'registration_failed') {
                                            Janus.warn("Registration failed: " + result["code"] + " " + result["reason"]);
                                            // 登录话机失败
                                            return;
                                        }
                                        if (event === 'registered') {
                                            // 登录话机成功
                                            Janus.log("Successfully registered as " + result["username"] + "!");
                                            // TODO Enable buttons to call now
                                            if (!that.registered) {
                                                that.registered = true;
                                            }
                                        }
                                        else if (event === 'calling') {
                                            Janus.log("Waiting for the peer to answer...");
                                            // TODO Any ringtone?
                                        }
                                        else if (event === 'incomingcall') {
                                            // 有来电或外呼
                                            Janus.log("Incoming call from " + result["username"] + "!");
                                            var callerNum = result["displayname"].replace(/"/g, "");
                                            if (callerNum === 'asterisk') {
                                                // 外呼
                                                console.log('在这里自动应答');
                                            }
                                        }
                                        else if (event === 'accepting') {
                                            // Response to an offerless INVITE, let's wait for an 'accepted'
                                        }
                                        else if (event === 'progress') {
                                            Janus.log("There's early media from " + result["username"] + ", wairing for the call!");
                                            Janus.log(jsep);
                                            // Call can start already: handle the remote answer
                                            if (jsep !== null && jsep !== undefined) {
                                                that.sipcall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
                                            }
                                        }
                                        else if (event === 'accepted') {
                                            var ringingTone = document.getElementById('webrtc_calleering');
                                            if (ringingTone) {
                                                ringingTone.pause();
                                            }
                                            Janus.log(result["username"] + " accepted the call!");
                                            Janus.log(jsep);
                                            // Call can start, now: handle the remote answer
                                            if (jsep !== null && jsep !== undefined) {
                                                that.sipcall.handleRemoteJsep({ jsep: jsep, error: that.doHangup });
                                            }
                                        }
                                        else if (event === 'hangup') {
                                            var ringingTone = document.getElementById('webrtc_calleering');
                                            if (ringingTone) {
                                                ringingTone.pause();
                                            }
                                            Janus.log("Call hung up (" + result["code"] + " " + result["reason"] + ")!");
                                            // Reset status
                                            that.sipcall.hangup();
                                        }
                                    }
                                },
                                onlocalstream: function (stream) {
                                    Janus.debug(" ::: Got a local stream :::");
                                    Janus.debug(stream);
                                    var body = document.querySelectorAll('body')[0];
                                    if (document.querySelectorAll('#myvideo').length === 0) {
                                        var video = document.createElement("video");
                                        video.setAttribute("id", "myvideo");
                                        video.setAttribute('autoplay', true);
                                        video.setAttribute('muted', 'muted');
                                        video.className = 'rounded centered';
                                        body.appendChild(video);
                                    }
                                    // m7$('body').append('<video class="rounded centered" id="myvideo" width=320 height=240 autoplay muted="muted"/>');
                                    Janus.attachMediaStream(document.getElementById('myvideo'), stream);
                                    document.getElementById("myvideo").muted = "muted";
                                    // No remote video yet
                                    if (document.querySelectorAll('#waitingvideo').length === 0) {
                                        var waitVideo = document.createElement("video");
                                        waitVideo.setAttribute('id', 'waitingvideo');
                                        waitVideo.className = 'rounded centered';
                                        body.appendChild(waitVideo);
                                    }
                                    // m7$('body').append('<video class="rounded centered" id="waitingvideo" width=320 height=240 />');
                                    var videoTracks = stream.getVideoTracks();
                                },
                                onremotestream: function (stream) {
                                    Janus.debug(" ::: Got a remote stream :::");
                                    Janus.debug(stream);
                                    var body = document.querySelectorAll('body')[0];
                                    if (document.querySelectorAll('#remotevideo').length === 0) {
                                        var video = document.createElement("video");
                                        video.setAttribute("id", "remotevideo");
                                        video.setAttribute('autoplay', true);
                                        body.appendChild(video);
                                    }
                                    // m7$('body').append(
                                    //     '<video class="rounded centered hide" id="remotevideo" width=320 height=240 autoplay/>');
                                    Janus.attachMediaStream(document.getElementById('remotevideo'), stream);
                                },
                                oncleanup: function () {
                                    Janus.log(" ::: Got a cleanup notification :::");
                                }
                            });
                        },
                        error: function (error) {
                            Janus.error(error);
                            // alert(error, function () {
                            //     window.location.reload();
                            // });
                            if (error === 'Lost connection to the gateway (is it down?)' || (error && error.indexOf('Probably a network error, is the gateway down?') !== -1)) {
                                that.started = false;
                                if (that.reconnect_set_time_out) {
                                    clearTimeout(that.reconnect_set_time_out);
                                }
                                that.reconnect_set_time_out = setTimeout(function () {
                                    // that.initWebSipPhone('sip:' + media_server, 'sip:' + sip_id + '@' + media_server, m7WebPhone.sip_id, m7WebPhone.sip_pwd, m7WebPhone.sip_id);
                                }, 2000);
                            }
                        },
                        destroyed: function () {
                            // m7WebPhone.onError('JanusError: destroyed')
                            // window.location.reload();
                        }
                    });
                }
            });
        };
        this.doHangup = function () {
            // Hangup a call
            var hangup = { "request": "hangup" };
            _this.sipcall.send({ "message": hangup });
            _this.sipcall.hangup();
        };
        var ishttps = 'https:' == document.location.protocol ? true : false;
        this.getInitConfig(options);
    }
    handleWebrtc.prototype.getInitConfig = function (options) {
        var that = this;
        var qhbUrl = 'https://txwebphone.7moor.com';
        var kickToken = options.agentNumber + '-' + new Date().getTime();
        // const query = {
        //   kickToken,
        //   loginName: options.agentNumber,
        //   password: MD5(options.password as string)
        // }
        var query = {
            "loginName": "1000@testwj",
            "password": "3e6c7d141e32189c917761138b026b74",
            "kickToken": "1000@testwj-168690523550"
        };
        return window.fetch(qhbUrl + '/action', {
            method: 'POST',
            body: 'action=softphone.loginNoCode&data=' + JSON.stringify(query),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (res) {
            return res.json();
        }).then(function (response) {
            console.log(response, 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
            var media_server = response.media_ip + ':' + response.media_port;
            that.initWebSipPhone('sip:' + media_server, 'sip:' + response.sip_id + '@' + media_server, response.sip_id, response.sip_pwd, response.sip_id);
        }).catch(function (res) {
            console.log(res);
        });
    };
    return handleWebrtc;
}());
export default handleWebrtc;
