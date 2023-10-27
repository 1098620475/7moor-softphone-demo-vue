import * as INTERFACE from './interface';
export default class handleStatus {
    constructor(options: INTERFACE.GetStatusConfig);
    private ws;
    private attachEventCallbacks;
    private statusConfig;
    private initStatus;
    private RegisterByWs;
    private RegisterByJsonp;
    private isGetJsonpStateProcess;
    private getJsonpState;
    private fetchByJsonpGet;
    attachEvent: (callbacks: any) => void;
    private handleEvent;
    private eventProcess;
    static noop: () => void;
    LoginInfo?: any;
}
//# sourceMappingURL=status.d.ts.map