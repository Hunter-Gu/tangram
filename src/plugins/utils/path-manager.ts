export class PathManager {
  static Seperator = ".";

  static ChildrenPropName = "children";

  static concatIndex(index: number) {
    return this.ChildrenPropName + this.Seperator + index;
  }

  static concat(...paths: (string | number)[]) {
    return paths.filter((path) => path !== "").join(this.Seperator);
  }
}
