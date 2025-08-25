const [saved, {wattMs, durations}, agile, carbon] = global.get(['multiMode', 'consumption', 'agile', 'carbon']);
const cutoff = saved.roundNow();
const keys = new Set(Object.keys(agile).concat(Object.keys(carbon)));

const graphss = [[[], [], []], [[], [], []]], table = [];
for (const dt of Array.from(keys).sort()) {
    const d = new Date(dt);
    const p = agile[dt];
    const c = carbon[dt] || [NaN, NaN];
    const future = dt >= cutoff;

    const graphs = graphss[+future];
    graphs[0].push({x: d, y: Math.floor(p * 10)});
    if (c) {
        graphs[1].push({x: d, y: c[0]});
        graphs[2].push({x: d, y: c[1]});
    }

    if (future && p !== undefined) {
        table.push({dt, p: p.toFixed(0), c: c[0]});
    }
}

const consumption = Array(24);
for (const h in wattMs) {
    consumption[h] = wattMs[h] / durations[h];
}

return [
    {payload: [{"series": ["Agile", "CO2", "CO2 Actual"], "data": graphss[0]}]},
    {payload: [{"series": ["Agile", "CO2", "CO2 Actual"], "data": graphss[1]}]},
    {payload: table, saved, consumption, topic: 'decisions_table_v2'}
];