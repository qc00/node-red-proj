const M=shared.Mode;

switch (msg.payload) {
case M.Charge:
case M.Invert:
    const hour = new Date().getHours();
    if (hour > 10) {
        node.status({ text: "PS off" });
        return [{ payload: 1 }, { payload: 0 }];
    }
case M.Bypass:
    node.status({text: "PS needs manual control"});
    return;
default:
    throw new Error("Unexpected mode: " + JSON.stringify(msg));
}
