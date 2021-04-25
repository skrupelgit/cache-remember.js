declare const _default: {
    config: {
        autoClearEntries: number;
        autoClearMaxTime: number;
    };
    store: any;
    getDomainKeys: (domain: string) => string[];
    getExpirationDate(key: any): {
        key: any;
        date: Date;
    };
    getDomainExpirationDates: (domain: string) => any;
    getFromStoreOrHandler: (store: any, key: string, handler: any) => Promise<any>;
    remember: (key: string, time: number, handler: any) => Promise<any>;
    autoClear: (key: string, handler: any) => Promise<any>;
    autoUpdate: (key: string, handler: any) => any;
};
export default _default;
