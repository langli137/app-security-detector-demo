import { HydratedData } from './hydrate.js';

type UpdatePayloadValue = string | boolean | HydratedData;
type DataTree = Record<string, UpdatePayloadValue | ReturnType<HydratedData>>;
interface UpdatePayload {
    path: string;
    value: UpdatePayloadValue;
}

export type { DataTree, UpdatePayload, UpdatePayloadValue };
