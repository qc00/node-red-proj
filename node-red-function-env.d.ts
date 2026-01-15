// Per https://nodered.org/docs/user-guide/writing-functions

interface NodeRedContext {
    get<T = any>(key: string): T | undefined;
    get<T = any>(keys: string[]): (T | undefined)[];
    get<T = any>(key: string, callback: (err: Error | null, value: T) => void): void;
    get<T = any>(keys: string[], callback: (err: Error | null, ...values: T[]) => void): void;

    set<T = any>(key: string, value: T): void;
    set<T = any>(keys: string[], values: T[]): void;
    set<T = any>(key: string, value: T, callback: (err: Error | null) => void): void;
    set<T = any>(keys: string[], values: T[], callback: (err: Error | null) => void): void;

    keys(): string[];
    keys(callback: (err: Error | null, keys: string[]) => void): void;

    get<T = any>(key: string, store: string): T | undefined;
    get<T = any>(key: string, store: string, callback: (err: Error | null, value: T) => void): void;

    set<T = any>(key: string, value: T, store: string): void;
    set<T = any>(key: string, value: T, store: string, callback: (err: Error | null) => void): void;

    keys(store: string): string[];
    keys(store: string, callback: (err: Error | null, keys: string[]) => void): void;
}

declare const context: NodeRedContext & {
    flow: NodeRedContext;
    global: NodeRedContext;
};
declare const flow: NodeRedContext;
//declare const global: NodeRedContext;


type NodeRedStatusFill = 'red' | 'green' | 'yellow' | 'blue' | 'grey';
type NodeRedStatusShape = 'ring' | 'dot';

interface NodeRedStatus {
    fill?: NodeRedStatusFill;
    shape?: NodeRedStatusShape;
    text?: string;
}

declare const node: {
    id: string;
    name: string;
    outputCount: number;

    log(message: string): void;
    warn(message: string): void;
    error(message: string, msg?: any): void;
    debug(message: string): void;
    trace(message: string): void;

    send(msg: any | any[], clone?: boolean): void;
    done(): void;

    status(status: NodeRedStatus): void;
    on(event: 'close', callback: () => void): void;
};

declare const env: {
    get(name: string): any;
};

declare const RED: {
    util: {
        cloneMessage<T>(msg: T): T;
    };
};

declare const msg: any | {
    _msgid: string
}

declare interface Message<T = any> {
    topic: string;
    payload: T;
    [rest: string]: any;
}
