// msg, data_key, extract_date, extract_data, saving, node
return flow.get('handleResponse')(msg, node, 
    (p) => p.data,
    (o) => o.from,
    (o) => [o.intensity.forecast, o.intensity.actual],
    (d) => global.set("carbon", d));