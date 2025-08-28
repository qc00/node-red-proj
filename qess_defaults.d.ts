import type { Mode } from '@qc00/qess/shared.mts';

declare global {
    interface MultiModeObject {
        [slot: string]: Mode;
        curr: Mode;
    }

    interface NodeRedContextGlobal {
        get(key: "multiMode"): MultiModeObject;
    }
}
