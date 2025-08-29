let creds, topicBase;
const p = msg.payload;
if (!p) {
    throw new Error("falsy payload");
} else if (typeof p === 'string') {
    node.status({text: p});
    if (p !== "Reset") [creds, topicBase] = context.get(["creds","topicBase"]);
    if (!creds) return [{flush: p === "Reset"}];
} else {
    creds = p;
    topicBase = `/open/${creds.certificateAccount}/${env.get("POWERSTREAM_SN")}/`;
    context.set(["creds","topicBase"], [creds, topicBase]);
    flow.set("topicSet", topicBase + "set")
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

return [
    null,
    [{}],
    [connect, {action: "subscribe", topic: topicBase + "quota"}],
    [{action: "subscribe", topic: topicBase + "set_reply"}]
];