declare type ExtenType = 'Local' | 'sip' | 'gateway';
declare type langType = 'zh_CN' | 'zh_TW' | 'en';
declare type transferType = 'in' | 'out';
export interface InitOptions {
    agentNumber: string;
    loginType: ExtenType;
    password: string;
    error?: Function;
    success?: Function;
    server?: string;
    debug?: Boolean;
    accountId: string;
    serviceAddress?: string;
    lang?: string;
    proxy_url?: string;
    busyType?: string;
}
export interface LoginOptions {
    loginName: InitOptions["agentNumber"];
    safeKey: String;
    extenType: InitOptions["loginType"];
    identifyCode?: string;
    lang: langType;
}
export interface BusinessRequestOptions {
    sessionId?: String;
    lang?: InitOptions["lang"];
}
export interface GetStatusConfig {
    url?: string;
    agentNumber?: string;
    ipMessage?: string;
    loginType?: string;
    password?: string;
    busyType?: string;
    success?: Function;
    fail?: Function;
}
export interface JSONPRequestOptions {
    jsonData?: any;
    url?: string;
}
declare type dialoutCallType = 'dialout' | 'inner';
export interface DIALOUTOPTIONS {
    calleeNumber: string;
    success?: Function;
    fail?: Function;
    CallType?: dialoutCallType;
}
export interface HANGUPOPTIONS {
    Exten?: string;
    Channel?: string;
    success?: Function;
    fail?: Function;
}
export interface BINDGATEWAYSIP {
    sipNumber?: string;
    success?: Function;
    fail?: Function;
    loginType?: String;
    mobile?: String;
}
export interface GETEXPLICIT {
    fail?: Function;
    success?: Function;
    type?: String;
}
export interface LOGOUT {
    sipNumber?: string;
    success?: Function;
    fail?: Function;
    offlineAnswering?: Boolean;
}
export interface AGENTSTATUS {
    success?: Function;
    fail?: Function;
    statusValue: String;
}
export interface TRANSFEROPTIONS {
    type?: transferType;
    success?: Function;
    fail?: Function;
    TransferReason?: string;
    TransferNumber?: string;
}
export interface CONSULTOPTIONS {
    type?: transferType;
    success?: Function;
    fail?: Function;
    ConsultNumber?: string;
}
export {};
//# sourceMappingURL=interface.d.ts.map