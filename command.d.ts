interface Command {
  // executes against the current document selection
  execute(value?: any): void;
  queryState(): boolean;
  queryEnabled(): boolean;

  // executes against the given `range` object
  execute(range: Range, value?: any): void;
  queryState(range: Range): boolean;
  queryEnabled(range: Range): boolean;
}
export = Command;
