const timeout = context.get("timeout");
if (timeout)
    clearTimeout(timeout);
if (msg.payload === 1) {
    const metrics = flow.get(["pv2InputVolt", "pv2OpVolt", "pv2InputWatts"]);
    function check(secondRound = true) {
        const within1Min = Date.now() - 60000;
        for (const m of metrics) {
            const v = m && m.latestSince(within1Min);
            if (v === 0 || (v !== undefined && metrics[0]?.val === 0)) {
                node.status({ shape: "dot", fill: "green", text: new Date().toLocaleTimeString() });
                node.send(msg);
                return true;
            }
        }
        if (secondRound) {
            node.status({ shape: "dot", fill: "red", text: "PV2 status unknown" });
            node.send(msg);
        }
        return false;
    }
    if (!check(false)) {
        node.status({ shape: "ring", fill: "yellow", text: "Waiting for MPPT output to turn off" });
        context.set("timeout", setTimeout(check, 5000));
    }
    return;
}
else {
    node.status({ shape: "ring", fill: "yellow", text: "" });
    return msg;
}
