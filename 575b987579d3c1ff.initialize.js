const config = {
    numToKeep: metricModule.Metric.numToKeep,
    maxCount: 0,

    ALWAYS_AVAILABLE: ["invStatue", "batInputVolt"],
    INV_MAPPING: [0,/*1-5:*/ 8, 9, 0, 0, 10, 7],
    exclude: new Set(["_config","eventInfo","dstTime","heartbeatFrequency","heartbeatType2Frequency","installCountry","installTown",
    "ratedPower","rssiVariance","timeZone","utcTime","wifiConnectChannel","wifiEncryptMode"]),
};

const Metric = config.Metric = metricModule.Metric.bind(null, config);

for (const k of config.ALWAYS_AVAILABLE) {
    context.set(k, new Metric());
}
context.set("_config", config);