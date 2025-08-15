const {Mode, Bms: {AllowToCharge} = {}} = global.get('victronenergy')?.vebus?._261;
const mode = Mode === 3 && AllowToCharge? 1 : Mode;
global.set("currMultiMode", mode);

const name = ["", "Charge", "Invert", "Bypass", "Off"][mode];
const desc = `${Mode}${AllowToCharge}=${name}`;
node.status({text: desc});
return {payload: desc};