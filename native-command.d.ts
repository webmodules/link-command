/// <reference path="require.d.ts" />
/**
* TypeScript dependencies.
*/
import Command = require('./command');
/**
* `NativeCommand` class that implements the `Command` interface on top of
* the native `document.execCommand()`, `document.queryCommandState()`, and
* `document.queryCommandEnabled()` functions.
*
* ``` js
* var bold = new NativeCommand('bold', document);
* bold.execute();
* ```
*
* @public
*/
declare class NativeCommand implements Command {
    public name: string;
    public document: Document;
    constructor(name: string, doc?: Document);
    public execute(range?: Range, value?: any): void;
    public queryState(range?: Range): boolean;
    public queryEnabled(range?: Range): boolean;
    private getCurrentSelection();
    private getCurrentRange(sel?, index?);
}
export = NativeCommand;
