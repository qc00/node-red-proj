const {lastDate, wattMs, durations} = c = global.get("consumption");

const localHour = context.get("toLocalHour");
function decay(msFromNow) { return Math.pow(0.999999, msFromNow / 1000); }

if (msg.topic.endsWith("| Watts")) {
    const now = new Date();
    if (lastDate) { // Can calculate delta watt
        const hour = localHour(lastDate);
        const diff = now - lastDate;
        const factor = decay(diff);
        const w = wattMs[hour] = wattMs[hour] * factor + c.lastWatts * diff;
        const d = durations[hour] = durations[hour] * factor + diff;
        c.samples += 1;
        node.status({fill:"green", shape:"dot", text: `${c.samples} samples. Avg: ${w/d} @ ${hour}h`});
    }
    c.lastDate = now;
    c.lastWatts = msg.payload;
} else if (msg.topic.startsWith("installations stats") && msg.payload?.success){
    wattMs.fill(0);
    durations.fill(0);
    const p = msg.payload.records.consumption;
    let cumu = 0;
    for (const i of p) {
        const hour = localHour(new Date(i[0]));
        const weight = 3600000 * decay(Date.now() - i[0]);
        wattMs[hour] += i[1] * weight;
        durations[hour] += weight;
        cumu += i[1];
    }
    c.samples = p.length;
    node.status({fill:"green", shape:"ring", text: `${c.samples} samples. Avg: ${cumu / c.samples}W`});
}
