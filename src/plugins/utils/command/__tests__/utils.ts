import { BaseCommand } from "../base-command";
import { Diff } from "../types";

export function getDiff<T>(command: BaseCommand<T>): Diff<T> {
  // @ts-ignore
  return command.diff;
}
