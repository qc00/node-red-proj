const localHourFmt = new Intl.DateTimeFormat("en-GB", {hour: "numeric", timeZone: "Europe/London"});

global.set("toLocalHour", (date) => +localHourFmt.format(date));

// =======
function arr24() { let a = Array(24); a.fill(0); return a; }

const consumption = {
    samples: 0,
    wattMs: arr24(),
    durations: arr24()
};

global.set("consumption", consumption);