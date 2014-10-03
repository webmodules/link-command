/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('command');
import NativeCommand = require('native-command');

/**
 * JavaScript dependencies.
 */

var setRange = require('selection-set-range');
var isBackward = require('selection-is-backward');
var contains = require('node-contains');
var closest = require('component-closest');
var wordAtCaret = require('word-at-caret');
var currentRange = require('current-range');
var currentSelection = require('current-selection');
var domIterator = require('dom-iterator');
var insertNode = require('range-insert-node');
var debug = require('debug')('link-command');

/**
 * `LinkCommand` class wraps the native "createLink" and "unlink" command
 * into a single Command implementation with some more sane defaults.
 *
 * ``` js
 * var link = new LinkCommand();
 * link.execute('http://google.com');
 * ```
 *
 * @public
 */

class LinkCommand implements Command {
  public document: Document;
  public createLink: Command;
  public unlink: Command;
  public href: string;

  constructor(doc?: Document) {
    this.document = doc || document;
    this.createLink = new NativeCommand('createLink', this.document);
    this.unlink = new NativeCommand('unlink', this.document);
    this.href = '#';
    debug('created LinkCommand instance');
  }

  execute(range?: Range, value?: any): void {
    var isSel: boolean = false;
    var backward: boolean;
    var selection: Selection;

    var sel: Selection = currentSelection(this.document);
    if (null != range && !(range instanceof Range)) {
      value = range;
      range = null;
    }
    if (!range) {
      backward = isBackward(sel);
      range = currentRange(this.document);
      isSel = true;
    }
    if (!range) return;
    var command: Command;

    if (this.queryState(range)) {
      command = this.unlink;
      value = null;

      if (range.collapsed) {
        // no selection, so manually traverse up the DOM and find the A node
        var a: Node = closest(range.commonAncestorContainer, 'a', true);
        if (a) {
          debug('selecting A node contents %o', a);
          range.selectNodeContents(a);
        }
      }

    } else {
      command = this.createLink;
      if (!value) value = this.href;

      if (range.collapsed) {
        debug('finding surrounding word at caret for collapsed Range');
        // upon a collapsed Range, we want to find the surrounding "word" that
        // the cursor is touching, and then augment the Range to surround the word
        var wordRange: Range = wordAtCaret(range.endContainer, range.endOffset);
        if (wordRange) {
          debug('found surrounding word: %o', wordRange.toString());
          copyRange(range, wordRange);
        } else {
          debug('no surrounding word, inserting text "Link"');
          var text = this.document.createTextNode('Link');
          insertNode(range, text);
          range.setStart(text, 0);
          range.setStart(text, 4);
        }
      }

    }

    if (isSel) {
      // if no Range was explicitly passed in, then augment the current Selection
      // in the case that we modified the range (collapsd), so that native
      // browser selection works out properly after the command is executed.
      setRange(sel, range, backward);
      range = null;
    }

    command.execute(range, value);
  }

  queryEnabled(range?: Range): boolean {
    var current = range || currentRange(this.document);
    if (!current) return false;

    // WebKit seems to return `false` when a collapsed Range is used for "unlink".
    // This makes sense because unlink on an empty selection doesn't actually
    // work, however, we're using `wordAtCaret` above to ensure that there is
    // at least some selection. So always return `true` in this case.
    //
    // Opera seems to do the same thing, but for "createLink" instead.
    // This also makes sense, however we attempt to find the nearest A node when
    // collapsed and remove the entire thing. So also return `true` there as well.
    if (current.collapsed) {
      return true;
    } else {
      // When there's an actual selection, we can rely on the native "unlink"
      // and "createLink" command's `queryEnabled()` implementations.
      // Note that we're passing in the `range` argument that was passed in,
      // rather than the `current` Range, so that falsey values still fall through
      var command: Command = this.queryState(range) ? this.unlink : this.createLink;
      return command.queryEnabled(range);
    }
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;

    var next: Node = range.startContainer;
    var end: Node = range.endContainer;
    var iterator = domIterator(next).revisit(false);

    while (next) {
      var node: Node = closest(next, 'a', true);
      if (!node) return false;
      if (contains(end, next)) break;
      next = iterator.next(3 /* Node.TEXT_NODE */);
    }

    return true;
  }
}

// TODO: move out into standalone module?
function copyRange (source: Range, target: Range): void {
  debug('copyRange(%o, %o)', source, target);
  if (!target) return;
  source.setStart(target.startContainer, target.startOffset);
  source.setEnd(target.endContainer, target.endOffset);
}

export = LinkCommand;
