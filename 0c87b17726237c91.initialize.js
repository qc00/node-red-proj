let mm = global.get("multiMode");
if (!mm) {
    global.set("multiMode", mm = {});
}
mm.NAMES = [undefined, "Charge", "Invert", "Bypass", "Off"];
mm.roundNow = function roundNow() {
    const time = new Date();
    time.setMinutes(time.getMinutes() < 30? 0 : 30);
    return time.toISOString().substring(0, 16) + "Z";
}
