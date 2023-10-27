/*
 * @Author: Wangtao
 * @Date: 2023-05-25 18:02:57
 * @LastEditors: Wangtao
 * @LastEditTime: 2023-09-18 14:27:07
 */
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
import { rsaPassword, fetchByJsonpGet } from './until';
import handleStatus from './status';
import handleWebrtc from './webrtc';
var SoftPhone = /** @class */ (function () {
  function SoftPhone(options) {
      var _this = this;
      this.businessRequestObj = {};
      this.userInfo = {};
      this.accountInfo = {};
      this.getStatusConfig = {};
      this.channelMap = {
          Channel: '',
          LinkedChannel: '',
          exten: ''
      };
      // 主动获取事件附加信息
      this.eventAddInfo = {
          ThreeWayCallParties: [],
          eventTipKey: ''
      };
      this.attachEventCallbacks = {
          success: handleStatus.noop,
          error: handleStatus.noop,
          message: handleStatus.noop
      };
      this.currentType = 'unregister';
      this.busyType = '0';
      this.attachRegistrationStatus = false;
      this.attachCurrentEvent = null;
      this.attachEvent = (function (callbacks) {
          _this.attachEventCallbacks = callbacks;
          if (!_this.attachRegistrationStatus) {
              // 注册时 返回积压事件
              _this.attachRegistrationStatus = true;
              if (_this.attachCurrentEvent) {
                  _this.attachMessage(_this.attachCurrentEvent);
                  _this.attachCurrentEvent = null;
              }
          }
      });
      this._callApi = function () {
          var that = _this;
          return {
              dialout: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var _calleeNumber, CallType;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          _calleeNumber = params.calleeNumber;
                          CallType = params.CallType ? params.CallType : 'dialout';
                          if (CallType !== 'dialout' && CallType !== 'inner') {
                              CallType = 'dialout';
                          }
                          if (params.calleeNumber === null || params.calleeNumber === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'calleeNumber is is required!'
                              });
                              return [2 /*return*/];
                          }
                          else {
                              if (CallType === 'dialout') {
                                  _calleeNumber = '9' + _calleeNumber;
                              }
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Originate',
                                  ActionID: 'Originate' + Math.random(),
                                  Channel: 'SIP/' + that.statusVm.LoginInfo.SipNum,
                                  Context: that.statusVm.LoginInfo.Account,
                                  Exten: _calleeNumber,
                                  Priority: '1',
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  Timeout: 60000,
                                  Async: 'true',
                                  CallType: CallType,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID,
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              hangup: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var Channel;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          Channel = that.channelMap.Channel;
                          // 三方会话挂断
                          if (params.Channel) {
                              Channel = params.Channel;
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Hangup',
                                  ActionID: 'Hangup' + Math.random(),
                                  Channel: Channel,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              hold: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Hold',
                                  ActionID: 'Hold' + Math.random(),
                                  Channel: that.channelMap.Channel,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.callApi.saveLastType();
                                  that.currentType = 'hold';
                                  that.attachMessage({
                                      type: that.currentType
                                  });
                                  params.success();
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              unhold: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Unhold',
                                  ActionID: 'Unhold' + Math.random(),
                                  Channel: that.channelMap.Channel,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.callApi.restoreType();
                                  params.success();
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              transfer: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.TransferNumber === null || params.TransferNumber === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'TransferNumber is is required!'
                              });
                              return [2 /*return*/];
                          }
                          if (params.type === null || params.type === undefined) {
                              params.type = 'out';
                          }
                          if (params.type !== 'out' && params.type !== 'in') {
                              params.type = 'out';
                          }
                          if (params.type === 'out') {
                              params.TransferNumber = '9' + params.TransferNumber;
                          }
                          that.callApi.saveLastType();
                          that.currentType = 'transferWaiting';
                          that.attachMessage({
                              type: that.currentType
                          });
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Transfer',
                                  ActionID: 'Transfer' + Math.random(),
                                  Channel: that.channelMap.LinkedChannel,
                                  ExtraChannel: that.channelMap.Channel,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  Context: that.statusVm.LoginInfo.Account,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID,
                                  TransferReason: params.TransferReason || '',
                                  Exten: params.TransferNumber
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              canceltransfer: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var phoneJson;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          phoneJson = {
                              Command: 'Action',
                              Action: 'CancelTransfer',
                              ActionID: 'CancelTransfer' + Math.random(),
                              Channel: that.channelMap.LinkedChannel,
                              PBX: that.statusVm.LoginInfo.PBX,
                              Account: that.statusVm.LoginInfo.Account,
                              SessionID: that.statusVm.LoginInfo.SessionID,
                          };
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: phoneJson
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.callApi.restoreType();
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              consult: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.ConsultNumber === null || params.ConsultNumber === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'ConsultNumber is is required!'
                              });
                              return [2 /*return*/];
                          }
                          if (params.type === null || params.type === undefined) {
                              params.type = 'out';
                          }
                          if (params.type !== 'out' && params.type !== 'in') {
                              params.type = 'out';
                          }
                          if (params.type === 'out') {
                              params.ConsultNumber = '9' + params.ConsultNumber;
                          }
                          that.channelMap.exten = params.ConsultNumber;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Consult',
                                  Version: 'New',
                                  ActionID: 'Consult' + Math.random(),
                                  FromExten: that.statusVm.LoginInfo.SipNum,
                                  Timeout: 60000,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID,
                                  Exten: params.ConsultNumber
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.callApi.saveLastType();
                                  that.currentType = 'consultWaiting';
                                  that.attachMessage({
                                      type: that.currentType
                                  });
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              endconsult: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'StopConsult',
                                  ActionID: 'StopConsult' + Math.random(),
                                  FromExten: that.statusVm.LoginInfo.SipNum,
                                  Timeout: 60000,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  if (res.Message !== undefined) {
                                      if (res.Message === 'Idle') {
                                          that.currentType = 'peerstate';
                                      }
                                      else {
                                          that.callApi.restoreType();
                                      }
                                  }
                                  else {
                                      that.callApi.restoreType();
                                  }
                                  that.attachMessage({
                                      type: that.currentType
                                  });
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              cancelconsult: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  ConsultExten: that.channelMap.exten,
                                  Action: 'CancelConsult',
                                  FromExten: that.userInfo.exten,
                                  Timeout: 60000,
                                  ActionID: 'CancelConsult' + Math.random(),
                                  Channel: that.channelMap.LinkedChannel,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.callApi.restoreType();
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              transferconsult: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Transfer',
                                  ActionID: 'Transfer' + Math.random(),
                                  Channel: that.channelMap.LinkedChannel,
                                  ExtraChannel: that.channelMap.Channel,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  Context: that.statusVm.LoginInfo.Account,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID,
                                  TransferReason: params.TransferReason || '',
                                  Exten: '912345'
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              threewaycall: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'ThreeWayCall',
                                  ActionID: 'ThreeWayCall' + Math.random(),
                                  FromExten: that.statusVm.LoginInfo.SipNum,
                                  Exten: that.channelMap.exten,
                                  Timeout: 60000,
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.currentType = 'threeWayTalking';
                                  var event_1 = {
                                      type: that.currentType
                                  };
                                  if (res.ThreeWayCallParties && res.ThreeWayCallParties.length > 0) {
                                      event_1.ThreeWayCallParties = res.ThreeWayCallParties;
                                      that.eventAddInfo.ThreeWayCallParties = res.ThreeWayCallParties;
                                  }
                                  else {
                                      that.eventAddInfo.ThreeWayCallParties = [];
                                  }
                                  that.attachMessage(event_1);
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              getthreewaycalluser: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          params.success({
                              data: that.eventAddInfo.ThreeWayCallParties
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              transferSatisfaction: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var Context;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.Exten === null || params.Exten === undefined) {
                              params.Exten = '';
                          }
                          Context = that.statusVm.LoginInfo.Account + '-investigate';
                          if (params.Exten && params.Exten !== '') {
                              Context = that.statusVm.LoginInfo.Account + '-' + params.Exten + '-satisfaction';
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Transfer',
                                  ActionID: 'Transfer' + Math.random(),
                                  Exten: 's',
                                  Channel: that.channelMap.LinkedChannel,
                                  Timeout: 60000,
                                  CallType: 'investigate',
                                  UserID: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID,
                                  Context: Context
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              getInvestigateList: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                              verb: 'POST',
                              body: __assign(__assign({ action: 'common.getDicCache' }, that.businessRequestObj), { data: { type: 'investigateList' } }),
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                  if (res.success) {
                                      var returnArr = [];
                                      if (res.data && res.data.length > 0) {
                                          for (var key in res.data) {
                                              if (!res.data[key].SatisfactionGarde || res.data[key].SatisfactionGarde !== 'child') {
                                                  returnArr.push({
                                                      DisplayName: res.data[key].DisplayName,
                                                      Exten: res.data[key].Exten
                                                  });
                                              }
                                          }
                                      }
                                      params.success({
                                          data: returnArr
                                      });
                                  }
                                  else {
                                      params.fail({
                                          success: false,
                                          message: res.message
                                      });
                                  }
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              getIvrMenuList: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                              verb: 'POST',
                              body: __assign(__assign({ action: 'common.getDicCache' }, that.businessRequestObj), { data: { type: 'ivrMenu' } }),
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                  if (res.success) {
                                      var returnArr = [];
                                      if (res.data && res.data.length > 0) {
                                          for (var key in res.data) {
                                              if (!res.data[key].SatisfactionGarde || res.data[key].SatisfactionGarde !== 'child') {
                                                  returnArr.push({
                                                      DisplayName: res.data[key].DisplayName,
                                                      Exten: res.data[key].Exten
                                                  });
                                              }
                                          }
                                      }
                                      params.success({
                                          data: returnArr || []
                                      });
                                  }
                                  else {
                                      params.fail({
                                          success: false,
                                          message: res.message
                                      });
                                  }
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              toIvrMenu: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.Exten === null || params.Exten === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'Exten is is required!'
                              });
                              return [2 /*return*/];
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'IvrMenu',
                                  ActionID: 'IvrMenu' + Math.random(),
                                  Channel: that.channelMap.LinkedChannel,
                                  Context: params.Exten,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  that.callApi.saveLastType();
                                  that.currentType = 'ivrWaiting';
                                  that.attachMessage({
                                      type: that.currentType
                                  });
                                  params.success();
                              }
                              else {
                                  params.fail({
                                      success: false,
                                      message: res.Message
                                  });
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              saveLastType: function () {
                  that.lastType = that.currentType;
              },
              restoreType: function () {
                  that.currentType = that.lastType;
                  that.lastType = '';
                  that.attachMessage({
                      type: that.currentType
                  });
              }
          };
      };
      this._agentApi = function () {
          var that = _this;
          return {
              getAgentPhoneBarList: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var PhonebarConfig, splitArr, returnArr_1;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          PhonebarConfig = null;
                          if (that.statusVm && that.statusVm.LoginInfo && that.statusVm.LoginInfo.PhonebarConfig) {
                              PhonebarConfig = that.statusVm.LoginInfo.PhonebarConfig;
                          }
                          if (PhonebarConfig) {
                              splitArr = PhonebarConfig.split(',');
                              returnArr_1 = [];
                              splitArr.forEach(function (key) {
                                  var keyArr = key.split(':');
                                  if (keyArr[0] !== '99') {
                                      returnArr_1.push({
                                          label: keyArr[1],
                                          value: keyArr[0]
                                      });
                                  }
                              });
                              params.success({
                                  data: returnArr_1,
                                  success: true
                              });
                          }
                          else {
                              params.fail({
                                  success: false,
                                  message: 'get phonebar list error'
                              });
                          }
                          return [2 /*return*/];
                      });
                  });
              },
              updateAgentStatus: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var statusValue, isBusy;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          statusValue = params.statusValue + '';
                          if (!statusValue) {
                              params.fail({
                                  success: false,
                                  message: 'statusValue is required'
                              });
                              return [2 /*return*/];
                          }
                          isBusy = true;
                          if (statusValue === '0') {
                              isBusy = false;
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'Busy',
                                  ActionID: 'Busy' + Math.random(),
                                  Exten: that.statusVm.LoginInfo.UserID,
                                  Busy: isBusy,
                                  BusyType: statusValue,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              getUserStatus: function () {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          return [2 /*return*/, new Promise(function (resolve) {
                                  var phoneJson = {
                                      Action: 'GetAccUserStatus',
                                      ActionID: 'Busy' + Math.random(),
                                      PBX: that.statusVm.LoginInfo.PBX,
                                      Account: that.statusVm.LoginInfo.Account,
                                      WithReserve: true
                                  };
                                  fetchByJsonpGet({
                                      url: that.getStatusConfig.url,
                                      jsonData: phoneJson
                                  }).then(function (res) {
                                      if (res && res.Succeed) {
                                          resolve({
                                              success: true,
                                              data: res.UserStatus || []
                                          });
                                      }
                                      else {
                                          resolve({
                                              success: false
                                          });
                                      }
                                  });
                              })];
                      });
                  });
              },
              getOnlineAgents: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var userStatusInfo;
                      return __generator(this, function (_a) {
                          switch (_a.label) {
                              case 0:
                                  params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                                  params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                                  return [4 /*yield*/, that.agentApi.getUserStatus()];
                              case 1:
                                  userStatusInfo = _a.sent();
                                  if (!userStatusInfo.success) {
                                      params.fail();
                                      return [2 /*return*/];
                                  }
                                  SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                                      verb: 'POST',
                                      body: __assign(__assign({ action: 'common.getDicCache' }, that.businessRequestObj), { data: { type: 'agents' } }),
                                      headers: {
                                          'Content-Type': 'application/json'
                                      },
                                      success: function (res) {
                                          if (res.success) {
                                              userStatusInfo.agent;
                                              var agents_1 = res.data || [];
                                              var agentStatus = userStatusInfo.data;
                                              var currentUserId_1 = that.userInfo._id;
                                              var peers_1 = [];
                                              if (agentStatus.length > 0) {
                                                  agentStatus.forEach(function (statusAgent) {
                                                      var agentId = statusAgent.id;
                                                      agents_1.some(function (agent) {
                                                          if (agent._id === agentId && agent._id !== currentUserId_1) {
                                                              if (statusAgent.isBusy !== 'true') {
                                                                  var peer = {
                                                                      exten: agent.exten,
                                                                      DisplayName: agent.displayName + '[' + agent.exten + ']'
                                                                  };
                                                                  peers_1.push(peer);
                                                              }
                                                              return true;
                                                          }
                                                      });
                                                  });
                                              }
                                              params.success({
                                                  data: peers_1
                                              });
                                          }
                                          else {
                                              params.fail({
                                                  success: false,
                                                  message: res.message
                                              });
                                          }
                                      }
                                  });
                                  return [2 /*return*/];
                          }
                      });
                  });
              },
              // 获取座席信息
              getAgentInfo: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (that.userInfo) {
                              params.success({
                                  success: true,
                                  data: that.userInfo
                              });
                          }
                          else {
                              params.fail({
                                  success: false,
                                  message: 'init fail!'
                              });
                          }
                          return [2 /*return*/];
                      });
                  });
              },
              // 获取网关sip号
              getGatewaySips: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                              verb: 'POST',
                              body: __assign(__assign({ action: 'app.sip.getUnboundGatewaySips' }, that.businessRequestObj), { data: {} }),
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                  if (res.success) {
                                      var returnArr = res.data || [];
                                      params.success({
                                          data: returnArr
                                      });
                                  }
                                  else {
                                      params.fail({
                                          success: false,
                                          message: res.message
                                      });
                                  }
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              // 绑定网关sip号
              bindGatewaySip: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.sipNumber === null || params.sipNumber === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'sipNumber is is required!'
                              });
                              return [2 /*return*/];
                          }
                          SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                              verb: 'POST',
                              body: __assign(__assign({ action: 'app.sip.bindGatewaySip' }, that.businessRequestObj), { data: { sip: params.sipNumber } }),
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                  if (res.success) {
                                      that.userInfo.gatewayExten = params.sipNumber;
                                      params.success({});
                                  }
                                  else {
                                      params.fail({
                                          success: false,
                                          message: res.message
                                      });
                                  }
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              // 切换手机号
              updateAgentMobile: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.mobile === null || params.mobile === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'sipNumber is is required!'
                              });
                              return [2 /*return*/];
                          }
                          SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                              verb: 'POST',
                              body: __assign(__assign({ action: 'app.user.bindPhone' }, that.businessRequestObj), { data: { mobile: params.mobile } }),
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              success: function (res) {
                                  if (res.success) {
                                      that.userInfo.mobile = params.mobile;
                                      params.success({});
                                  }
                                  else {
                                      params.fail({
                                          success: false,
                                          message: res.message
                                      });
                                  }
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              // 切换登陆方式
              changeLoginType: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var extenNum;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.loginType === null || params.loginType === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'loginType is required!'
                              });
                              return [2 /*return*/];
                          }
                          extenNum = '';
                          if (params.loginType === 'Local') {
                              extenNum = that.userInfo.mobileExten;
                          }
                          else if (params.loginType === 'gateway') {
                              extenNum = that.userInfo.gatewayExten;
                          }
                          else if (params.loginType === 'sip') {
                              extenNum = that.userInfo.sipExten;
                          }
                          else {
                              params.fail({
                                  success: false,
                                  message: 'loginType is error!'
                              });
                              return [2 /*return*/];
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  Command: 'Action',
                                  Action: 'SetExtenType',
                                  ActionID: 'SetExtenType' + Math.random(),
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  User: that.statusVm.LoginInfo.UserID,
                                  ExtenType: params.loginType,
                                  LoginExten: extenNum
                              }
                          }).then(function (res) {
                              that.userInfo.loginType = params.loginType;
                              if (res && res.Succeed) {
                                  params.success();
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              Logout: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.offlineAnswering === null || params.offlineAnswering === undefined) {
                              params.offlineAnswering = true;
                          }
                          fetchByJsonpGet({
                              url: that.getStatusConfig.url,
                              jsonData: {
                                  ipMessage: that.getStatusConfig.ipMessage,
                                  Command: 'Action',
                                  Action: 'Logoff',
                                  ActionID: 'Logoff' + Math.random(),
                                  QueueRemove: params.offlineAnswering,
                                  User: that.statusVm.LoginInfo.UserID,
                                  PBX: that.statusVm.LoginInfo.PBX,
                                  Account: that.statusVm.LoginInfo.Account,
                                  SessionID: that.statusVm.LoginInfo.SessionID,
                              }
                          }).then(function (res) {
                              if (res && res.Succeed) {
                                  params.success();
                              }
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              // 获取外显规则
              getExplicitRules: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var dialoutPolicy, returnArr, smallConfigType, showDisPlay;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          dialoutPolicy = that.userInfo.dialoutPolicy;
                          returnArr = [];
                          if (dialoutPolicy) {
                              // 外显策略
                              Object.keys(dialoutPolicy).forEach(function (item) {
                                  if (item === 'agentNumberFlag') {
                                      // 专属号码
                                      if (dialoutPolicy[item]) {
                                          returnArr.push({
                                              label: '专属号码',
                                              value: 'agentNumber'
                                          });
                                      }
                                  }
                                  if (item === 'intelligentDisplayFlag') {
                                      // 外显号策略
                                      if (dialoutPolicy[item]) {
                                          returnArr.push({
                                              label: '智能外显',
                                              value: 'intelligentDisplay'
                                          });
                                      }
                                  }
                                  if (item === 'accountNumberFlag') {
                                      // 企业号码轮流
                                      if (dialoutPolicy[item]) {
                                          returnArr.push({
                                              label: '企业号码',
                                              value: 'accountNumber'
                                          });
                                      }
                                  }
                                  if (item === 'advancedPolicy') {
                                      if (dialoutPolicy[item]) {
                                          returnArr.push({
                                              label: '高级策略',
                                              value: 'advancedPolicy'
                                          });
                                      }
                                  }
                              });
                          }
                          smallConfigType = that.userInfo.small;
                          showDisPlay = true;
                          if (smallConfigType === '1') {
                              // 使用小号
                              returnArr = [{
                                      label: '小号模式',
                                      value: 'small'
                                  }];
                              showDisPlay = false;
                          }
                          else if (smallConfigType === '3') {
                              // 小号和线路并用
                              returnArr.push({
                                  label: '小号模式',
                                  value: 'small'
                              });
                          }
                          if (returnArr.length > 0 && showDisPlay) {
                              returnArr.push({
                                  label: '常规线路',
                                  value: 'normal'
                              });
                          }
                          params.success({
                              data: returnArr
                          });
                          return [2 /*return*/];
                      });
                  });
              },
              getExplicitDataByType: function (params) {
                  return __awaiter(this, void 0, void 0, function () {
                      var dialoutPolicy, agentNumber, numberStr, queryNumberStr, dialoutPolicy, selectId_1, query, currentSmallType, setArr, user, setArr;
                      return __generator(this, function (_a) {
                          params.success = (params && typeof params.success == "function") ? params.success : SoftPhone.noop;
                          params.fail = (params && typeof params.fail == "function") ? params.fail : SoftPhone.noop;
                          if (params.type === null || params.type === undefined) {
                              params.fail({
                                  success: false,
                                  message: 'type is is required!'
                              });
                              return [2 /*return*/];
                          }
                          if (params.type === 'agentNumber') {
                              dialoutPolicy = that.userInfo.dialoutPolicy;
                              agentNumber = dialoutPolicy.agentNumber || [];
                              numberStr = agentNumber.map(function (item) {
                                  return item;
                              });
                              queryNumberStr = numberStr.join(',');
                              SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                                  verb: 'POST',
                                  body: __assign(__assign({ action: 'config.numberManage.queryByServiceNum' }, that.businessRequestObj), { data: {
                                          numberStr: queryNumberStr
                                      } }),
                                  headers: {
                                      'Content-Type': 'application/json'
                                  },
                                  success: function (res) {
                                      if (res.success) {
                                          var dialoutList = res.list || [];
                                          var canUseNumber = dialoutList.filter(function (item) {
                                              var type = item.status;
                                              var status = false;
                                              if (type === 'inUse') {
                                                  status = true;
                                              }
                                              else if (type === 'outUse') {
                                                  status = false;
                                              }
                                              else if (type === 'trial') {
                                                  status = true;
                                              }
                                              else if (type === 'gift') {
                                                  status = true;
                                              }
                                              else {
                                                  status = false;
                                              }
                                              var lineType = item.lineStatus;
                                              var lineStatus = false;
                                              if (lineType === 'normal') {
                                                  lineStatus = true;
                                              }
                                              else if (lineType === 'fault') {
                                                  lineStatus = false;
                                              }
                                              else {
                                                  lineStatus = false;
                                              }
                                              return lineStatus && status;
                                          }).map(function (item) {
                                              return item.number;
                                          });
                                          var selectOptions = canUseNumber.map(function (item) {
                                              return {
                                                  label: item,
                                                  value: item
                                              };
                                          });
                                          params.success({
                                              data: selectOptions
                                          });
                                      }
                                      else {
                                          params.fail({
                                              success: false,
                                              message: res.message
                                          });
                                      }
                                  }
                              });
                          }
                          else if (params.type === 'intelligentDisplay') {
                              dialoutPolicy = that.userInfo.dialoutPolicy;
                              selectId_1 = dialoutPolicy.intelligentDisplay || [];
                              query = {
                                  Account: that.accountInfo.account
                              };
                              SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                                  verb: 'POST',
                                  body: __assign(__assign({ action: 'config.callerGroup.queryBizGroups' }, that.businessRequestObj), { data: query }),
                                  headers: {
                                      'Content-Type': 'application/json'
                                  },
                                  success: function (res) {
                                      if (res.success) {
                                          var selectOptions_1 = [];
                                          var dialoutList = res.list || [];
                                          dialoutList.filter(function (item) {
                                              return item.Enable;
                                          }).forEach(function (item) {
                                              if (selectId_1.indexOf(item._id) > -1) {
                                                  selectOptions_1.push({
                                                      label: item.DisplayName,
                                                      value: item._id
                                                  });
                                              }
                                          })(params.success)({
                                              data: selectOptions_1
                                          });
                                      }
                                      else {
                                          params.fail({
                                              success: false,
                                              message: res.message
                                          });
                                      }
                                  }
                              });
                          }
                          else if (params.type === 'small') {
                              currentSmallType = that.accountInfo.smallType;
                              setArr = [];
                              if (currentSmallType === 'B1') {
                                  setArr = [{
                                          label: '随机抽取',
                                          value: currentSmallType
                                      }];
                              }
                              else if (currentSmallType === 'B2') {
                                  setArr = [{
                                          label: '归属地',
                                          value: currentSmallType
                                      }];
                              }
                              else if (currentSmallType === 'A') {
                                  // 座席绑定
                                  SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                                      verb: 'POST',
                                      body: __assign(__assign({ action: 'app.smallnum.fetchUserSmallNumList' }, that.businessRequestObj), { data: {} }),
                                      headers: {
                                          'Content-Type': 'application/json'
                                      },
                                      success: function (res) {
                                          if (res.success) {
                                              var selectOptions = [];
                                              if (res.data && res.data.length > 0) {
                                                  selectOptions = res.data.map(function (item) {
                                                      return {
                                                          label: '座席绑定（' + item.num + '）',
                                                          value: item.num,
                                                          city: item.province + '-' + item.city
                                                      };
                                                  });
                                              }
                                              ;
                                              params.success({
                                                  data: selectOptions
                                              });
                                          }
                                          else {
                                              params.fail({
                                                  success: false,
                                                  message: res.message
                                              });
                                          }
                                      }
                                  });
                                  return [2 /*return*/];
                              }
                              ;
                              params.success({
                                  data: setArr
                              });
                          }
                          else if (params === 'advancedPolicy') {
                              user = that.userInfo;
                              if (user.senior && user.senior === 'match') {
                                  setArr = [{
                                          label: '归属地随机',
                                          value: ''
                                      }];
                                  params.success({
                                      data: setArr
                                  });
                              }
                              else {
                                  SoftPhone.request(that.initConfig.serviceAddress + '/sdk/v1/action', {
                                      verb: 'POST',
                                      body: __assign(__assign({ action: 'app.user.fetchPooledCallerNumbers' }, that.businessRequestObj), { data: {} }),
                                      headers: {
                                          'Content-Type': 'application/json'
                                      },
                                      success: function (res) {
                                          if (res.success) {
                                              var chosen_1 = res.data.chosen || '';
                                              var pool = res.data.pool || [];
                                              var hasValue_1 = false;
                                              var setArr = pool.map(function (number) {
                                                  if (chosen_1 && chosen_1 === number) {
                                                      hasValue_1 = true;
                                                  }
                                                  return {
                                                      label: number,
                                                      value: number
                                                  };
                                              });
                                              params.success({
                                                  data: setArr
                                              });
                                          }
                                          else {
                                              params.fail({
                                                  success: false,
                                                  message: res.message
                                              });
                                          }
                                      }
                                  });
                              }
                          }
                          return [2 /*return*/];
                      });
                  });
              }
          };
      };
      options.error = (typeof options.error == "function") ? options.error : SoftPhone.noop;
      options.success = (typeof options.success == "function") ? options.success : SoftPhone.noop;
      if (options.agentNumber === null || options.agentNumber === undefined) {
          options.error({ message: "Invalid agentNumber" });
          return;
      }
      else {
          this.getStatusConfig.agentNumber = options.agentNumber;
      }
      if (options.password === null || options.password === undefined) {
          options.error({ message: "Invalid password" });
          return;
      }
      else {
          this.getStatusConfig.password = options.password;
      }
      if (options.lang === null || options.lang === undefined) {
          options.lang = 'zh_CN';
      }
      if (options.proxy_url === null || options.proxy_url === undefined) {
          options.error({ message: "Invalid proxy_url" });
          return;
      }
      else {
          this.getStatusConfig.url = options.proxy_url;
      }
      if (!options.serviceAddress) {
          if (options.accountId === null || options.password === undefined) {
              options.error({ message: "Invalid accountId" });
              return;
          }
          else {
              var accountId = options.accountId;
              var identifying = accountId.substring(0, 1);
              if (identifying === 'N') {
                  options.serviceAddress = 'https://kf.7moor.com';
              }
              else if (identifying === 'T') {
                  options.serviceAddress = 'https://ykf.7moor.com';
              }
              else {
                  options.error({ message: "accountId format error" });
                  return;
              }
          }
      }
      console.log(options, 'ooooooooooooooooooooooooooo');
      if (options.loginType === null || options.loginType === undefined) {
          options.loginType = 'Local';
      }
      if (options.busyType === null || options.busyType === undefined) {
          options.busyType = '0';
      }
      this.getStatusConfig.loginType = options.loginType;
      this.getStatusConfig.busyType = options.busyType;
      var usedDependencies = SoftPhone.useDefaultDependencies({});
      SoftPhone.request = usedDependencies.request;
      this.getpublickey(options);
  }
  SoftPhone.noop = function () { };
  SoftPhone.prototype.getpublickey = function (options) {
      return __awaiter(this, void 0, void 0, function () {
          var _this = this;
          return __generator(this, function (_a) {
              SoftPhone.request(options.serviceAddress + '/sdk/v1/public-key', {
                  verb: 'GET', body: {},
                  success: function (res) {
                      if (res.success) {
                          _this.getStatusConfig.ipMessage = res.ipMessage;
                          var safekey = rsaPassword(res.secret, res.num, options.password);
                          var codeObj = {};
                          res.token1 ? codeObj.identifyCode = codeObj.token1 : codeObj = {};
                          _this.login(__assign(__assign({ "loginName": options.agentNumber, "safeKey": safekey, "extenType": options.loginType }, codeObj), { "lang": options.lang }), options);
                      }
                  },
                  error: function (error) {
                      console.log(error, 'hhhhhhhhhhhhhhhhhhh');
                  }
              });
              return [2 /*return*/];
          });
      });
  };
  SoftPhone.prototype.login = function (LoginOptions, InitOptions) {
      return __awaiter(this, void 0, void 0, function () {
          var _this = this;
          return __generator(this, function (_a) {
              SoftPhone.request(InitOptions.serviceAddress + '/sdk/v1/login', {
                  verb: 'POST',
                  body: LoginOptions,
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  success: function (res) { return __awaiter(_this, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                          this.businessRequestObj.sessionId = res.sessionId;
                          this.businessRequestObj.lang = InitOptions.lang;
                          this.userInfo = res.user;
                          this.userInfo.loginType = InitOptions.loginType;
                          this.accountInfo = res.account;
                          this.initConfig = InitOptions;
                          // let getAccountPBX = await this.getAccountPbx(InitOptions)
                          this.initStatus(InitOptions);
                          return [2 /*return*/];
                      });
                  }); }
              });
              return [2 /*return*/];
          });
      });
  };
  SoftPhone.prototype.initStatus = function (InitOptions) {
      return __awaiter(this, void 0, void 0, function () {
          var that;
          var _this = this;
          return __generator(this, function (_a) {
              that = this;
              this.attachEventCallbacks.success = (that.attachEventCallbacks.success && typeof that.attachEventCallbacks.success == "function") ? that.attachEventCallbacks.success : handleStatus.noop;
              this.attachEventCallbacks.error = (that.attachEventCallbacks.error && typeof that.attachEventCallbacks.error == "function") ? that.attachEventCallbacks.error : handleStatus.noop;
              this.attachEventCallbacks.message = (that.attachEventCallbacks.message && typeof that.attachEventCallbacks.message == "function") ? that.attachEventCallbacks.message : handleStatus.noop;
              this.getStatusConfig.success = InitOptions.success || handleStatus.noop;
              this.statusVm = new handleStatus(this.getStatusConfig);
              this.statusVm.attachEvent({
                  message: function (event) {
                      var changeType = _this.currentType;
                      var changeBusyType = _this.busyType || '0';
                      // 未注册
                      if (event.Event === 'UserStatus') {
                          if (_this.statusVm.LoginInfo.UserID === event.UserID) {
                              if (event.PeerStatus === 'Unregistered') {
                                  _this.currentType = 'unregister';
                                  if (that.userInfo.loginType === 'sip') {
                                      new handleWebrtc(_this.getStatusConfig);
                                  }
                              }
                          }
                      }
                      // 被踢
                      if (event.Event === 'kick') {
                          _this.currentType = 'kick';
                      }
                      // 转移成功提示
                      if (event.Event === 'TransferSuccess') {
                          if (_this.statusVm.LoginInfo.UserID === event.UserID) {
                              _this.eventAddInfo.eventTipKey = 'TransferSuccess';
                          }
                      }
                      // ivr转接中-结束
                      if (that.currentType === 'ivrWaiting') {
                          if (event.Event === 'IvrMenuEnd') { // 转ivr菜单
                              if (event.VAL_OF_IVR_MENU) {
                                  var outIvrRefused = event.VAL_OF_IVR_MENU;
                                  if (outIvrRefused === 'DTSF') {
                                      that.eventAddInfo.eventTipKey = 'ivrFaild';
                                      that.callApi.restoreType();
                                      return;
                                  }
                                  else {
                                      that.eventAddInfo.eventTipKey = 'ivrSuccess';
                                      that.callApi.restoreType();
                                      return;
                                  }
                              }
                          }
                          else if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                              }
                          }
                          else if (event.Event === 'UserBusy') {
                              if (that.statusVm.LoginInfo.UserID === event.UserID) {
                                  that.busyType = event.BusyType;
                                  that.currentType = 'peerstate';
                              }
                          }
                      }
                      // 未连接-空闲
                      if (event.Event === 'ConsultSuccess' || event.Event === 'ConsultFailed') {
                          if (event.Event === 'ConsultSuccess') {
                              that.currentType = 'consultTalking';
                              that.eventAddInfo.eventTipKey = 'ConsultSuccess';
                          }
                          else if (event.Event === 'ConsultFailed') {
                              that.eventAddInfo.eventTipKey = 'ConsultFailed';
                              that.callApi.restoreType();
                              return;
                          }
                      }
                      if (that.currentType === 'transferWaiting') {
                          if (event.Event === 'TransferFailed') {
                              that.eventAddInfo.eventTipKey = 'TransferFailed';
                              that.callApi.restoreType();
                              return;
                          }
                          else if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                              }
                          }
                          else if (event.Event === 'UserBusy') {
                              if (that.statusVm.LoginInfo.UserID === event.UserID) {
                                  that.busyType = event.BusyType;
                                  that.currentType = 'peerstate';
                              }
                          }
                      }
                      if (_this.currentType === 'unregister') {
                          if (event.Event === 'PeerStatus') { // 电话条注册状态
                              if (event.Exten === that.statusVm.LoginInfo.SipNum || that.statusVm.LoginInfo.UserID === event.UserID) { // 若是当前登录的坐席
                                  if (event.PeerStatus === 'Registered') { // 注册上了
                                      that.currentType = 'peerstate';
                                  }
                              }
                          }
                          else if (event.Event === 'UserStatus') { // 坐席状态
                              if (event.UserID === that.statusVm.LoginInfo.UserID) { // 是当前坐席
                                  if (event.PeerStatus === 'Registered') { // 注册上了
                                      that.currentType = 'peerstate';
                                  }
                              }
                          }
                      }
                      // 空闲-其他
                      if (_this.currentType === 'peerstate') {
                          if (event.Event === 'UserBusy') {
                              if (that.statusVm.LoginInfo.UserID === event.UserID) {
                                  that.busyType = event.BusyType;
                                  that.currentType = 'peerstate';
                              }
                          }
                          else if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') {
                                      that.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Ringing') { // 被呼振铃
                                      if (event.LinkedChannel && event.LinkedChannel.Data && event.LinkedChannel.Data.TransferReason) {
                                      }
                                      if (event.LinkedChannel.ChannelType === 'normal') { // 普通来电
                                          _this.currentType = 'belling';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'inner') { // 内部通话
                                          _this.currentType = 'innerBelling';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'transfer') { // 来电转接
                                          _this.currentType = 'transferBelling';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialTransfer') { // 外呼转接
                                          // 转接振铃
                                          _this.currentType = 'transferDialing';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialout') {
                                          _this.currentType = 'belling';
                                      }
                                  }
                                  else if (event.ChannelStatus === 'Ring') { // 呼叫振铃
                                      if (event.ChannelType === 'dialout') { // 外呼
                                          // 外呼振铃
                                          _this.currentType = 'dialing';
                                      }
                                      else if (event.ChannelType === 'inner') { // 内部通话
                                          _this.currentType = 'innerDialing';
                                      }
                                      else if (event.ChannelType === 'listen') { // 监听
                                          _this.currentType = 'listening';
                                      }
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'normal') { // 普通通话
                                          _this.currentType = 'talking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'threeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'inner') { // 内部通话
                                          _this.currentType = 'innerTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialout') { // 外呼
                                          _this.currentType = 'dialTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'transfer') {
                                          _this.currentType = 'transfer'; // 转接通话
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialTransfer') { // 外呼转接
                                          _this.currentType = 'dialTransfer';
                                      }
                                  }
                                  else if (event.ChannelStatus === 'Up') { // 接起电话
                                      if (event.ChannelType === 'listen') { // 监听中
                                          _this.currentType = 'listened';
                                      }
                                      else if (event.ChannelType === 'dialout') {
                                          // 解决 外呼中 重启 电话条后处理
                                          _this.currentType = 'dialing';
                                      }
                                  }
                              }
                          }
                          else if (event.Event === 'PeerStatus') { // 电话条注册状态
                              if (event.Exten === _this.statusVm.LoginInfo.SipNum) {
                                  if (event.PeerStatus !== 'Registered') { // 没有注册上（未连接）
                                      _this.currentType = 'unregister';
                                  }
                              }
                          }
                      }
                      // 呼叫中 
                      if (_this.currentType === 'dialing') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.ChannelType === 'dialout') { // 外呼
                                          _this.currentType = 'dialTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 内部呼叫中
                      if (_this.currentType === 'innerDialing') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.ChannelType === 'inner') { // 内部通话
                                          _this.currentType = 'innerTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 来电振铃
                      if (_this.currentType === 'belling') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'normal') { // 普通来电
                                          _this.currentType = 'talking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'threeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'transfer') { // 来电转接
                                          _this.currentType = 'transfer';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialTransfer') { // 外呼转接
                                          _this.currentType = 'dialTransfer';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialout') {
                                          // 抢接来电
                                          _this.currentType = 'talking';
                                      }
                                  }
                              }
                          }
                      }
                      // _cti_innerBelling
                      if (_this.currentType === 'innerBelling') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'threeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'inner') { // 内部通话
                                          _this.currentType = 'innerTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 6 监听振铃
                      if (_this.currentType === 'listening') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) { // 是当前坐席
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Up') { // 接起电话
                                      if (event.ChannelType === 'listen') { // 监听
                                          _this.currentType = 'peerstate';
                                      }
                                  }
                              }
                          }
                      }
                      // 7 普通通话
                      if (_this.currentType === 'talking') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 咨询通话
                      if (_this.currentType === 'consultTalking') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      if (_this.currentType === 'consultWaiting') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 14 转接通话
                      if (_this.currentType === 'transfer') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 15 外呼转接通话
                      if (_this.currentType === 'dialTransfer') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 8 三方通话
                      if (_this.currentType === 'threeWayTalking') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                              }
                          }
                      }
                      // 9 内部通话
                      if (_this.currentType === 'innerTalking') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                              }
                          }
                      }
                      // 10 外呼通话
                      if (_this.currentType === 'dialTalking') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接诶
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // 11 监听中
                      if (_this.currentType === 'listened') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                              }
                          }
                      }
                      // 12 转接振铃
                      if (_this.currentType === 'transferBelling') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'normal') { // 普通来电
                                          _this.currentType = 'talking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'threeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'transfer') { // 来电转接
                                          _this.currentType = 'transfer';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialTransfer') { // 外呼转接
                                          _this.currentType = 'dialTransfer';
                                      }
                                  }
                              }
                          }
                      }
                      // 13 转接振铃
                      if (_this.currentType === 'transferDialing') {
                          if (event.Event === 'ChannelStatus') {
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'normal') { // 普通来电
                                          _this.currentType = 'talking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'threeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'transfer') { // 来电转接
                                          _this.currentType = 'transfer';
                                      }
                                      else if (event.LinkedChannel.ChannelType === 'dialTransfer') { // 外呼转接
                                          _this.currentType = 'dialTransfer';
                                      }
                                  }
                              }
                          }
                      }
                      // 16 保持
                      if (_this.currentType === 'hold') {
                          if (event.Event === 'ChannelStatus') { // 解决保持通话，若是客户先挂断电话，电话条不动的问题
                              if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                                  if (event.ChannelStatus === 'Hangup') { // 挂断操作
                                      _this.currentType = 'peerstate';
                                  }
                                  else if (event.ChannelStatus === 'Link') { // 双方建立连接
                                      if (event.LinkedChannel.ChannelType === 'ThreeWayCall') { // 三方会话
                                          _this.currentType = 'threeWayTalking';
                                      }
                                  }
                              }
                          }
                      }
                      // if (event.Event === 'ChannelStatus') {
                      //   if (event.Channel) {
                      //     that.currentChannel = event.Channel
                      //   }
                      // }
                      if (event.Channel) {
                          if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                              that.channelMap.Channel = event.Channel;
                          }
                      }
                      if (event.LinkedChannel && event.LinkedChannel.Channel) {
                          if (event.Exten === that.statusVm.LoginInfo.SipNum) {
                              that.channelMap.LinkedChannel = event.LinkedChannel.Channel;
                          }
                      }
                      if (changeType !== _this.currentType) {
                          console.log('状态更新了', {
                              type: that.currentType
                          });
                          var backObj = {
                              type: that.currentType
                          };
                          if (_this.currentType === 'peerstate') {
                              backObj.typeValue = that.busyType || '0';
                          }
                          _this.attachMessage(backObj);
                      }
                      else {
                          if (_this.currentType === 'peerstate') {
                              if (changeBusyType !== that.busyType) {
                                  _this.attachMessage({
                                      type: that.currentType,
                                      typeValue: that.busyType
                                  });
                              }
                          }
                      }
                  }
              });
              return [2 /*return*/];
          });
      });
  };
  SoftPhone.prototype.getAccountPbx = function (InitOptions) {
      return __awaiter(this, void 0, void 0, function () {
          var _this = this;
          return __generator(this, function (_a) {
              return [2 /*return*/, new Promise(function (resolve) {
                      SoftPhone.request(InitOptions.serviceAddress + '/sdk/v1/action', {
                          verb: 'POST',
                          body: __assign(__assign({ action: 'common.getDicCache' }, _this.businessRequestObj), { data: { type: 'accountPbx' } }),
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          success: function (res) {
                              resolve({
                                  success: true,
                                  data: res.data
                              });
                          }
                      });
                  })];
          });
      });
  };
  SoftPhone.useDefaultDependencies = function (deps) {
      var f = (deps && deps.fetch) || fetch;
      var p = (deps && deps.Promise) || Promise;
      var socketCls = (deps && deps.WebSocket) || WebSocket;
      return {
          newWebSocket: function (server, proto) { return new socketCls(server, proto); },
          request: function (url, options) {
              var fetchOptions = {
                  method: options.verb,
                  cache: 'no-cache',
                  'referrerPolicy': 'no-referrer',
                  'referrer': 'no-referrer'
              };
              if (options.body !== undefined && options.verb !== 'GET') {
                  fetchOptions.body = JSON.stringify(options.body);
              }
              if (options.headers) {
                  fetchOptions.headers = options.headers;
              }
              var fetching = f(url, fetchOptions).catch(function (error) {
                  console.log(error);
                  return p.reject({ message: 'Probably a network error, is the gateway down?', error: error });
              });
              if (options.timeout !== undefined) {
                  var timeout = new p(function (resolve, reject) {
                      var timerId = setTimeout(function () {
                          clearTimeout(timerId);
                          options.error({ message: 'Request timed out', timeout: options.timeout });
                          return reject({ message: 'Request timed out', timeout: options.timeout });
                      }, options.timeout);
                  });
                  fetching = p.race([fetching, timeout]);
              }
              fetching.then(function (response) {
                  if (response.ok) {
                      if (typeof (options.success) === typeof (SoftPhone.noop)) {
                          return response.json().then(function (parsed) {
                              options.success(parsed);
                          }).catch(function (error) {
                              options.error({ message: 'Failed to parse response body', error: error, response: response });
                              return p.reject({ message: 'Failed to parse response body', error: error, response: response });
                          });
                      }
                  }
                  else {
                      options.error({ message: 'API call failed', response: response });
                      return p.reject({ message: 'API call failed', response: response });
                  }
              }).catch(function (error) {
                  if (typeof (options.error) === typeof (SoftPhone.noop)) {
                      options.error(error.message || '<< internal error >>', error);
                  }
              });
              return fetching;
          }
      };
  };
  SoftPhone.prototype.attachMessage = function (backInfo) {
      if (this.eventAddInfo.eventTipKey) {
          // 需要做事件提示的key值 用于事件提示场景 咨询失败 转移失败 ivr失败等
          backInfo.eventTipKey = this.eventAddInfo.eventTipKey;
      }
      // 还未注册 保留当前状态
      if (!this.attachRegistrationStatus) {
          this.attachCurrentEvent = backInfo;
      }
      this.attachEventCallbacks.message(backInfo);
      this.eventAddInfo.eventTipKey = '';
  };
  Object.defineProperty(SoftPhone.prototype, "callApi", {
      get: function () {
          return this._callApi();
      },
      enumerable: false,
      configurable: true
  });
  Object.defineProperty(SoftPhone.prototype, "agentApi", {
      get: function () {
          return this._agentApi();
      },
      enumerable: false,
      configurable: true
  });
  return SoftPhone;
}());
export default SoftPhone;
