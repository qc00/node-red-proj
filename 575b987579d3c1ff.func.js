const config = context.get('_config');

const p = msg.payload.param || msg.payload;
const date = new Date();
if (msg.topic) { // MQTT
    switch (msg.payload.cmdId * 100 + msg.payload.cmdFunc) {
    case 120:
        break;
    case 13420: // Scheduled task
        return;
    default:
        node.warn("Unexpected message from Ecoflow: " + JSON.stringify(msg));
        return;
    }

    for (let key in p) {
        let existing = flow.get(key);
        if (!existing) {
            flow.set(key, existing = new config.Metric());
        }
        existing.push(p[key], date);
    }
    
    node.status({text: date.toLocaleString()});
} else {
    const {ALWAYS_AVAILABLE} = config;
    const alwaysAvailable = flow.get(ALWAYS_AVAILABLE);
    for (let i in ALWAYS_AVAILABLE) {
        alwaysAvailable[i].push(p[ALWAYS_AVAILABLE[i]], date);
    }
}

const pv2 = flow.get('pv2InputWatts')?.latestSince(date-60000) || 0;
const invStatue = flow.get('invStatue').val;
const batInputVolt = flow.get('batInputVolt').val;

function pl(val, factor) {
    return val || val === 0 ? {payload: factor ? val / factor : val} : null;
}

const output = [
    null,
    pl(config.INV_MAPPING[invStatue]), // #2
    pl(invStatue === 6 ? p.invOpVolt: 0, 10),
    pl(invStatue === 6 ? p.invOutputCur: 0, 1000), // 4
    pl(invStatue === 6 ? p.invOutputWatts - pv2: 0, 10),
    pl(p.invOutputLoadLimit, 10), // 6
    pl(p.batInputVolt, 10),
    pl(-p.batInputWatts / batInputVolt), // 8
    pl(-p.batInputWatts, 10),
    pl(p.batSoc), // 10
    {payload: p}
    ];

// Exclude keys for InfluxDB _after_ the output might has used them
for (const key of config.exclude) {
    delete p[key];
}

return output;