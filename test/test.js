
var assert = require('assert');
var LinkCommand = require('../');

describe('LinkCommand', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  describe('new LinkCommand()', function () {

    it('should create a `LinkCommand` instance', function () {
      var link = new LinkCommand();

      assert(link instanceof LinkCommand);
      assert(link.document === document);
    });

    describe('execute()', function () {

      it('should insert an A node around Range', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // create Range
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 2);

        var link = new LinkCommand();
        link.execute(range);

        console.log(range.startContainer, range.startOffset);
        console.log(range.endContainer, range.endOffset);
        assert.equal('<p>h<a href="#">e</a>llo</p>', div.innerHTML);
      });

      it('should insert an A node around Range (with link)', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // create Range
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 4);

        var link = new LinkCommand();
        link.execute(range, 'http://foo.com');

        console.log(range.startContainer, range.startOffset);
        console.log(range.endContainer, range.endOffset);
        assert.equal('<p>h<a href="http://foo.com">ell</a>o</p>', div.innerHTML);
      });

      it('should insert an A node around word at collapsed Range', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>foo bar baz</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // create Range
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 5);
        range.setEnd(div.firstChild.firstChild, 5);
        assert(range.collapsed);

        var link = new LinkCommand();
        link.execute(range);

        console.log(range.startContainer, range.startOffset);
        console.log(range.endContainer, range.endOffset);
        assert.equal('<p>foo <a href="#">bar</a> baz</p>', div.innerHTML);
      });

      it('should insert an A node around word at collapsed Range (with link)', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>foo bar baz</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // create Range
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 0);
        range.setEnd(div.firstChild.firstChild, 0);
        assert(range.collapsed);

        var link = new LinkCommand();
        link.execute(range, 'http://foo.org');

        console.log(range.startContainer, range.startOffset);
        console.log(range.endContainer, range.endOffset);
        assert.equal('<p><a href="http://foo.org">foo</a> bar baz</p>', div.innerHTML);
      });

      it('should insert an A node around current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 2);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var link = new LinkCommand();
        link.execute();

        //console.log(sel.focusNode, sel.anchorNode);
        assert.equal('<p>h<a href="#">e</a>llo</p>', div.innerHTML);
      });

    });

  });

});
