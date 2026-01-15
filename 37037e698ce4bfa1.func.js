const M=shared.Mode;

switch (msg.payload) {
case M.Charge:
case M.Invert:
    const hour = new Date().getHours();
    flow.set("Output", 0);
    if (hour < 10) {
        node.status({ text: "PS off" });
        return { topic: "mode_change", payload: 1 };
    }
    break;
case M.Bypass:
    node.status({text: "Priority needs manual control"});
    flow.set("Output", 1);
    return { topic: "mode_change" };
default:
    throw new Error("Unexpected mode: " + JSON.stringify(msg));
}
