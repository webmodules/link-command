/// <reference path='require.d.ts' />

/**
 * TypeScript dependencies.
 */

import Command = require('command');
import NativeCommand = require('native-command');

/**
 * JavaScript dependencies.
 */

var closest = require('component-closest');
var currentRange = require('current-range');
var unwrapNode = require('unwrap-node');
var wordAtCaret = require('word-at-caret');
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
  public href: String;

  constructor(doc?: Document) {
    this.document = doc || document;
    this.createLink = new NativeCommand('createLink', this.document);
    this.unlink = new NativeCommand('unlink', this.document);
    this.href = '#';
    debug('created LinkCommand instance');
  }

  execute(range?: Range, value?: any): void {
    if (!range) range = currentRange(this.document);
    if (!range) return;

    if (this.queryState(range)) {
      if (range.collapsed) {
        // no selection, so manually traverse up the DOM and find the A node
        var a = closest(range.commonAncestorContainer, 'a', true);
        if (a) {
          debug('manually unwrapping node %o', a);
          unwrapNode(a);
        }
      } else {
        // leverage native "unlink" if there's a selection
        this.unlink.execute(range);
      }
    } else {
      if (range.collapsed) {
        debug('finding surrounding word at caret for collapsed Range');
        // upon a collapsed Range, we want to find the surrounding "word" that
        // the cursor is touching, and then augment the Range to surround the word
        var r2 = wordAtCaret(range.endContainer, range.endOffset);
        if (r2) {
          range.setStart(r2.startContainer, r2.startOffset);
          range.setEnd(r2.endContainer, r2.endOffset);
        }
      }
      return this.createLink.execute(range, value || this.href);
    }
  }

  queryEnabled(range?: Range): boolean {
    var cmd = this.queryState(range) ? this.unlink : this.createLink;
    return cmd.queryEnabled(range);
  }

  queryState(range?: Range): boolean {
    if (!range) range = currentRange(this.document);
    if (!range) return false;
    var a = closest(range.commonAncestorContainer, 'a', true);
    return !! a;
  }
}

export = LinkCommand;
