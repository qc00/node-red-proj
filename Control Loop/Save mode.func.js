const {Mode, Bms: {AllowToCharge} = {}} = global.get('victronenergy')?.vebus?._261;
const mode = Mode === 3 && AllowToCharge? 1 : Mode;

const mm = global.get("multiMode");
mm.curr = mode;

const name = shared.Mode[mode] || "Invalid";
const desc = `${Mode}${AllowToCharge}=${name}`;
node.status({text: desc});
return {payload: desc};