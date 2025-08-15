function roundNow() {
    let time = new Date();
    time.setMinutes(time.getMinutes() < 30? 0 : 30);
    return time.toISOString().substring(0, 16) + "Z";
}

global.set('roundNow', roundNow);