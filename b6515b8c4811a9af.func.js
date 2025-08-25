/** @type {{last: Date, ids: Record<string, boolean>[], SHORT_BUCKET: Symbol}} */
const s = context.get("state");
const date = new Date();
const change = env.get("CHANGE");
const gapSec = env.get("GAP");
const gaps2Keep = env.get("GAPS2KEEP");

if (gapSec <= 0) throw new Error("Invalid Gap setting: " + gapSec);
if (change && typeof msg.payload !== "number") {
    node.warn("Change% is set but msg.payload is not a number: " + JSON.stringify(msg));
}

// Ignore message if it has been output alredy
const id = msg._msgid;
const dup = s.ids.findLast(b => b && (id in b));
if (dup && dup[id] === true) {
    return;
}

// Resolve id buckets
const gapsFromLast = (date - s.last) / 1000 / gapSec;
const idx = s.ids.length - 1 + Math.floor(gapsFromLast);
let noBucketAtIndex;
const bucket = (s.ids[idx] ||= (noBucketAtIndex = {}));

// Decide
let send;

if (noBucketAtIndex) { // diff >= gap or first message
    send = msg;
} else if (dup || (Math.abs(msg.payload - s.lastVal) * 100 > Math.abs(msg.payload * change))) {
    send = msg;
    bucket[s.SHORT_BUCKET] = gapsFromLast;
    s.ids.push({});
}

// Update state
bucket[id] ||= !!send;
if (send) {
    s.last = date;
    if (change) s.lastVal = msg.payload;
}

// Stats
let totalGaps = 0, shortCount = 0, sum = 0, i = s.ids.length - 1;
for (; i >= 0 && totalGaps < gaps2Keep; i--) {
    const b = s.ids[i];
    if (b) {
        const short = b[s.SHORT_BUCKET];
        if (short) shortCount++;
        totalGaps += short || 1;
        sum += Object.keys(b).length;
    } else {
        totalGaps++;
    }
}
if (i) s.ids = s.ids.slice(i);

return [send, { payload: `Avg ${(sum / totalGaps).toFixed(1)}/${gapSec}s` }];  