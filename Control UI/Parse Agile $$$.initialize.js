function handleFail(msg, node) {
    switch (msg.statusCode) {
    case 'OK':
    case 200:
        context.set("handleFailWait", null);
        return false;
    default:
        const wait = context.get("handleFailWait") * 2 || 5000;
        context.set("handleFailWait", wait);

        setTimeout(() => {
            const arr = Array(node.outputCount);
            arr[node.outputCount-1] = {
                payload: Date.now(),
                _handleFail: wait
            };
            node.send(arr);
            node.done();
        }, wait);
        // fall-through:
    case 400:
        node.warn(`Request fail: ${JSON.stringify(msg.payload)}`);
        return true;
    }
}

const dateFormat = Intl.DateTimeFormat('en-GB', {
    timeZoneName: 'short', hour: '2-digit', minute:'2-digit'
});

function handleResponse(msg, node, extract_payload, extract_date, extract_data, saving) {
    if (handleFail(msg, node)) return;

    const out = {};
    let min="9", max="0", count=0;
    for (const o of extract_payload(msg.payload)) {
        const d = extract_date(o);
    	out[d.substring(0, 16) + "Z"] = extract_data(o);
    	if (d < min) min = d;
    	if (d > max) max = d;
    	count++;
    }
    saving(out);
    node.status({text: `${min.substring(8, 16)}-${max.substring(8, 16)}|${count}`});
    return [{payload: 1, updated: dateFormat.format(Date.now())}]
}

flow.set('handleResponse', handleResponse);