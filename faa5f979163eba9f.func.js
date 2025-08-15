// msg, data_key, extract_date, extract_data, saving, node
return flow.get('handleResponse')(msg, node,
    (p) => p.results,
    (o) => o.valid_from,
    (o) => o.value_inc_vat,
    (d) => global.set("agile", d));
