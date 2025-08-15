const val = msg.payload;

switch(msg.topic) {
case "Multi Compact | Batt Volt":
    context.set('volt', val);
    if (val < 24) {
        context.set('lowBatt', 2);
    }
    break;

case "Multi Compact | Low Batt":
    context.set('lowBatt', val);
    break;

case "multiMode Save":
case "ticker":
    break;
default:
    node.error("Unexpected msg: " + JSON.stringify(msg));
    return;
}

const [lowBatt, volt] = context.get(["lowBatt", "volt"]);
const time = global.get("roundNow")();
const saved = global.get("multiMode")[time];
const curr = global.get("currMultiMode");


const mode = (lowBatt === 2 && (saved || curr) === 2) ? 3 : saved;
const genMode = +(mode === 1);

node.debug(`time=${time}, topic=${msg.topic}, lowBatt=${lowBatt}, mode=${mode}, gen=${genMode}`);
node.status({
    fill: ["green", "yellow", "red"][lowBatt],
    shape: ["ring", "dot"][genMode],
    text:  `${volt}V | ${[`(${curr})`, "Charge", "Invert", "Bypass", "Off"][mode || 0]}`
});

let alexaMsg;
if (mode !== 1) {
    alexaMsg = {
        "acknowledge":true,
        "payload" : {
            "state" : {
                "motion": lowBatt ? "DETECTED" : "NOT_DETECTED"
            }
        }
    };
}

return [alexaMsg, mode && {payload: mode === 1? 3 : mode}, mode && {payload: genMode}];