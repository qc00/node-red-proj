class ObjPool extends Array {
    queueEnd = 0; // When negative, points to the last message sent

    constructor(proto) {
        super();
        this.proto = Object.freeze(proto);
    }

    last() {
        return this[Math.abs(this.queueEnd) - 1];
    }

    next() {
        const qe = Math.max(0, this.queueEnd);
        if (qe === this.length) {
            // Make bunch of new ones
            let i = this.length;
            this.length+=10;
            for (; i < this.length; ++i) {
                this[i] = Object.create(this.proto);
            }
        }
        this.queueEnd = qe + 1;
        return this[qe];
    }
    
    exportUntil(cutoff, now) {
        const qe = this.queueEnd;
        if (qe <= 0) return [];

        const last = this[qe - 1];
        if (last.timestamp <= cutoff) {
            last.fields.duration = now - last.timestamp;
            this.queueEnd = -qe;
            return this.slice(0, qe);
        } else {
            const out = this.slice(0, qe - 1);
            if (qe > 2) {
                const tmp = this[qe - 1];
                this[qe - 1] = this[0];
                this[0] = tmp;
            }
            this.queueEnd = 1;
            return out;
        }
    }
}

const byPath = {};
const PATTERN = /(\w+)\/_?(\d+)[^<]*<([^>]+).*/;
const EMPTY_MSG = Object.freeze({fields: Object.freeze({}), timestamp: 0});
const MIN_GAP = 50;
const MAX_GAP = 3000; // Should capture 90% of normal readings
const _VI = ["I", "V"];
const RETAINED = {ActiveIn: _VI, Out: _VI, Dc: _VI};

function deferred({topic, payload}) {
    const date = new Date();
    const sepIdx = Math.max(topic.lastIndexOf('>'), topic.lastIndexOf('/'));
    const path = topic.slice(0, sepIdx);
    const col = topic.slice(sepIdx + 1);

    // Make/get pool
    let pool = byPath[path];
    if (!pool) {
        const [, devType, devId, measurement] = PATTERN.exec(topic);
        pool = byPath[path] = new ObjPool({measurement, tags: {[devType]: +devId}});
        pool.retain = RETAINED[measurement] || [];
    }

    const last = pool.last() || EMPTY_MSG;
    const gap = date - last.timestamp;
    if (gap >= MIN_GAP) { // New message
        const next = pool.next();
        const nf = next.fields = {};
        const lf = last.fields;
        nf[col] = payload;

        for (const retain of pool.retain) {
            if (retain !== col) {
                const retainTs = `last_${retain}_ts`;
                nf[retain] = lf[retain];
                nf[retainTs] = lf[retainTs] ?? last.timestamp-0;
            }
        }

        lf.duration = gap;
        next.timestamp = date;
    } else { // Existing message
        const f = last.fields;
        f[col] = f[col] ? f[col] * 0.4 + payload * 0.6 : payload;
        delete f[`last_${col}_ts`];
    }
}

setInterval(function interval() {
    const date = new Date();
    const cutoff = date - MAX_GAP;
    const outArrs = Object.values(byPath).map(p => p.exportUntil(cutoff, date));
    node.send({payload: outArrs.flat()});
}, 10000);

flow.set('byPath', byPath);
flow.set('deferred', deferred);