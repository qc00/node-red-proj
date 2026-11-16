const conns = {};
const tabs = {};

function add(id, t) {
    conns[id] = t;
    const tab = tabs[t] || (tabs[t] = []);
    tab.push(id);
    return {topic: 'dashboard', payload: tab, tab: t};
}

function remove(id, node) {
    const last = conns[id];
    if (last) {
        const tab = tabs[last];
        if (tab) {
            const idx = tab.indexOf(id);
            if (idx >= 0) {
                tab.splice(idx, 1);
                return {
                    topic: 'dashboard',
                    payload: tab,
                    tab: last,
                    reset: tab.length===0
                };
            }
        }
        node.log(`Connection ${id} is missing from tab ${last}.`);
    }
}

context.set(['conns', 'tabs', 'add', 'remove'], [conns, tabs, add, remove]);