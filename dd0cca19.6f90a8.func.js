const bytesPayload = context.get("bytesPayload");

return [bytesPayload(msg.payload.totalmem), bytesPayload(msg.payload.freemem)];