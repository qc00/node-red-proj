const defaultSize = 6;

/* Manual round-robin */
class Metric {
    static maxCount = 0;

    constructor() {
        this.count = -1;
        this.dv = Array(defaultSize);
    }

    push(val, date) {
        const c = this.count += 1;
        const m = Metric.maxCount = Math.max(c, Metric.maxCount);
        const a = this.dv;
        const l = a.length;

        if (l != 20 && (l != defaultSize || c*2 > l && c < m/10)) {
            // Allow rarely (c < m/10) updated metrics to grow to 10 samples
            a.push(date.getTime(), val);
        } else {
            const i = c*2 % l;
            a[i] = date.getTime();
            a[i+1] = val;
        }
    }
    
    latestSince(date) {
        const offset = this.count * 2 % this.dv.length;
        return this.dv[offset] > date ? this.dv[offset + 1] : undefined;
    }

    get val() {
        return this.latestSince(0);
    }
    
    toString() {
        try {
            const c = this.count;
            const a = this.dv;
            const l = Math.min(a.length, (c+1)*2);
            const out = Array(l+1);
    
            let last = Date.now();
            for (let i = c*2 % l, o = 0; o < l; i=(i+l-2)%l, o+=2) {
                const diff = (a[i] - last)/1000;
                out[o] = diff > -120 ? `${Math.round(diff)}s` : new Date(a[i]);
                last = a[i];
    
                out[o+1] = a[i+1];
            }
            out[out.length-1] = '#' + (this.count+1);
            return out;
        } catch(e) {
            return e.toString();
        }
    }
}

const ALWAYS_AVAILABLE = ["invStatue", "batInputVolt"];
for (const k of ALWAYS_AVAILABLE) {
    context.set(k, new Metric());
}
context.set("_config", {
    Metric,
    ALWAYS_AVAILABLE,
    INV_MAPPING: [0,/*1-5:*/ 8, 9, 0, 0, 10, 7],
    exclude: new Set(["_config","eventInfo","dstTime","heartbeatFrequency","heartbeatType2Frequency","installCountry","installTown","ratedPower","rssiVariance","timeZone","utcTime","wifiConnectChannel","wifiEncryptMode"])
});