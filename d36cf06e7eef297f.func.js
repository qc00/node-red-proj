const [add, remove, tabs] = context.get(['add', 'remove', 'tabs']);
const id = `${msg.socketip}:${msg.socketid}`;
const t = msg.name;
let added, removed;

/*
payload - connect, lost, change, or group.
socketid - the ID of the socket (this will change every time the browser reloads the page).
socketip - the ip address from where the connection originated.
tab - the number of the tab. (only for 'change' event).
name - the name of the tab. (only for 'change' event). 
*/
switch(msg.payload) {
    case "connect":
        break;
    case "lost":
        removed = remove(id, node);
        break;
    case "change":
        removed = remove(id, node);
        if (t)
            added = add(id, t);
}

return [added, removed, {payload: tabs}];