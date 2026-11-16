const param = {};
const prefix = "20_1.";

for (const [key, value] of Object.entries(msg.payload)) {
    if (key.startsWith(prefix)) {
        param[key.substring(prefix.length)] = value;
    }
}

return {payload: param};