
export enum Mode {
    Charge = 1,
    Invert = 2,
    Bypass = 3,
    Off = 4,
}

export function roundNow() {
    const time = new Date();
    time.setMinutes(time.getMinutes() < 30 ? 0 : 30);
    return time.toISOString().substring(0, 16) + "Z";
}

export function ensure<T>(ctx: NodeRedContext, key: string, factory: () => T): T {
    let out = ctx.get(key);
    if (!out) ctx.set(key, out = factory());
    return out;
}
