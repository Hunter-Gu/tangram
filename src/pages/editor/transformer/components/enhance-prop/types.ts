import { UpdateCommandStatData } from "../../../../../plugins/utils/command/types";

export type UpdateParams = Omit<UpdateCommandStatData, "path">;
