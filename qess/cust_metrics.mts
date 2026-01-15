import { Metric, MetricFamily } from "@qc00/rxnr/Metric.js";
export { ensure } from "./shared.mjs";

export class Load extends Metric<number> {
    static stats: MetricFamily = {maxCount: 0};

    constructor(public rarelyChange = false, public alwaysOn = false) {
        super(Load.stats);
    }
}
