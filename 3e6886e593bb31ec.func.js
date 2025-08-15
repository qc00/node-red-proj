const sn = "HW51ZKH4SF5P2451";
const p = msg.payload;

let creds;
if (!p) {
    throw new Error("falsy payload");
} else if (typeof p === 'string') {
    node.status({text: p});
    if (p !== "Reset") creds = context.get("creds");
    if (!creds) return [{sn, flush: p === "Reset"}];
} else {
    creds = p;
    context.set("creds", creds);
}

//const disconnect = {action: "disconnect"};
const connect = {
        action: "connect",
        broker: {
            broker: creds.url,
            port: creds.port,
            username: creds.certificateAccount,
            password: creds.certificatePassword
        }
    };
const sub = {
    action: "subscribe",
    topic: `/open/${creds.certificateAccount}/${sn}/quota`
};

return [
    null,
    [{sn}],
    [connect, sub]
];