import * as INTERFACE from './interface';
export default class SoftPhone {
    constructor(options: INTERFACE.InitOptions);
    static noop(): void;
    private businessRequestObj;
    private userInfo;
    private accountInfo;
    private getStatusConfig;
    private initConfig?;
    private statusVm?;
    private channelMap;
    private eventAddInfo;
    private attachEventCallbacks;
    private getpublickey;
    private login;
    private currentType?;
    private busyType?;
    private lastType?;
    private initStatus;
    private getAccountPbx;
    static request: (server: string, proto: any) => any;
    static useDefaultDependencies(deps: any): {
        newWebSocket(server: string, proto: any): any;
        request(url: string, options: any): any;
    };
    attachRegistrationStatus: Boolean;
    attachCurrentEvent: any;
    attachEvent: (callbacks: any) => void;
    attachMessage(backInfo: any): void;
    get callApi(): {
        dialout(params: INTERFACE.DIALOUTOPTIONS): Promise<void>;
        hangup(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        hold(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        unhold(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        transfer(params: INTERFACE.TRANSFEROPTIONS): Promise<void>;
        canceltransfer(params: INTERFACE.TRANSFEROPTIONS): Promise<void>;
        consult(params: INTERFACE.CONSULTOPTIONS): Promise<void>;
        endconsult(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        cancelconsult(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        transferconsult(params: INTERFACE.TRANSFEROPTIONS): Promise<void>;
        threewaycall(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        getthreewaycalluser(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        transferSatisfaction(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        getInvestigateList(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        getIvrMenuList(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        toIvrMenu(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        saveLastType(): void;
        restoreType(): void;
    };
    private _callApi;
    get agentApi(): {
        getAgentPhoneBarList(params: INTERFACE.DIALOUTOPTIONS): Promise<void>;
        updateAgentStatus(params: INTERFACE.AGENTSTATUS): Promise<void>;
        getUserStatus(): Promise<unknown>;
        getOnlineAgents(params: INTERFACE.AGENTSTATUS): Promise<void>;
        getAgentInfo(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        getGatewaySips(params: INTERFACE.HANGUPOPTIONS): Promise<void>;
        bindGatewaySip(params: INTERFACE.BINDGATEWAYSIP): Promise<void>;
        updateAgentMobile(params: INTERFACE.BINDGATEWAYSIP): Promise<void>;
        changeLoginType(params: INTERFACE.BINDGATEWAYSIP): Promise<void>;
        Logout(params: INTERFACE.LOGOUT): Promise<void>;
        getExplicitRules(params: INTERFACE.BINDGATEWAYSIP): Promise<void>;
        getExplicitDataByType(params: INTERFACE.GETEXPLICIT): Promise<void>;
    };
    private _agentApi;
}
//# sourceMappingURL=index.d.ts.map