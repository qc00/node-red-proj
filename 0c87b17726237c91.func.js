const val = msg.payload;

if (msg.topic.includes("Volt")) {
    context.set('volt', val);
    if (val < 24) {
        context.set('lowBatt', 2);
    }
} else if (msg.topic.includes("Low Batt")) {
    context.set('lowBatt', val); 
}

const [lowBatt, volt] = context.get(["lowBatt", "volt"]);

/** @type {{[slot: string]: number, roundNow: ()=>string, NAMES: string[]}} */
const mm = global.get("multiMode");
const slot = mm.roundNow();
let selected = mm[slot];
if (!selected) {
    let last = "";
    for (const key in mm) {
        // Properties like `curr` sorts after `20....`, so can't < slot
        if (key < slot && key > last) last = key;
    }
    selected = mm[last] || mm.curr;
}

const mode = (lowBatt === 2 && selected === 2/*invert*/) ? 3/*bypass*/ : selected;
const genMode = +(mode === 1);

node.debug(`slot=${slot}, topic=${msg.topic}, volt=${volt}, lowBatt=${lowBatt}, mode=${mode}, gen=${genMode}`);
node.status({
    fill: ["green", "yellow", "red"][lowBatt],
    shape: ["ring", "dot"][genMode],
    text: `${volt}V | ${mm.NAMES[mode] || mode}`
});

let alexaMsg;
if (mode !== 1) {
    alexaMsg = {
        "acknowledge": true,
        "payload": {
            "state": {
                "motion": lowBatt ? "DETECTED" : "NOT_DETECTED"
            }
        }
    };
}

return [alexaMsg, mode && { payload: mode === 1 ? 3 : mode }, mode && { payload: genMode }];
