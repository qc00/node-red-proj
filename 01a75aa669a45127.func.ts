import * as cust from '@qc00/qess/cust_metrics.mjs';


function main(msg: Message) {
    const date = new Date();

    const t = msg.topic;
    if (t !== "mode_change") {
        if (t && typeof (msg.payload) === "number") {
            const m = cust.ensure(context, t, () => new cust.Load(t === "extra" || t === "always" || !!msg.rarelyChange, t === "always" || !!msg.alwaysOn));
            m.push(msg.payload, date);
        } else {
            node.warn("Invalid message: " + JSON.stringify(msg));
        }
    }

    const cutoff = date.getTime() - 1800000;
    const output = flow.get("Output");

    const msgBuf: any[] = [date.toLocaleTimeString().substring(0, 5)];
    let total = 0;
    for (const key of context.keys()) {
        const pr = context.get(key);
        if (pr instanceof cust.Load) {
            const lastest = pr.rarelyChange ? pr.val : pr.latestSince(cutoff);
            if (lastest && (output || pr.alwaysOn)) {
                total += lastest;
                msgBuf.push(key, "+");
            }
        }
    }

    let status = "";
    if (total >= 20) {
        msgBuf.splice(-1, 1, "=", total);
        status = msgBuf.join("");
    } else {
        status = msgBuf[0] + " below min";
        total = 0;
    }
    node.status({ text: status, fill: output ? 'green' : 'red' })
    return { payload: total * 10 };
}
