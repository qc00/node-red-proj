node.status({text: msg.payload.loadavg.join(', ')});
return msg.payload.loadavg.map((x) => ({payload: x}));