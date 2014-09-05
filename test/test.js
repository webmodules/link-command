
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

        assert.equal('<p>h<a href="#">e</a>llo</p>', div.innerHTML);
      });

      it('should insert an A node around word at collapsed Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello world</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 8);
        range.setEnd(div.firstChild.firstChild, 8);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var link = new LinkCommand();
        link.execute();

        assert.equal('<p>hello <a href="#">world</a></p>', div.innerHTML);
      });

      it('should remove an A node around current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hel<a href="#">lo world</a></p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.lastChild.lastChild.firstChild, 0);
        range.setEnd(div.lastChild.lastChild.firstChild, 5);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var link = new LinkCommand();
        link.execute();

        assert.equal('<p>hello wo<a href="#">rld</a></p>', div.innerHTML);
      });

      it('should remove an A node around collapsed Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hel<a href="#">lo world</a></p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.lastChild.lastChild.firstChild, 5);
        range.setEnd(div.lastChild.lastChild.firstChild, 5);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var link = new LinkCommand();
        link.execute();

        assert.equal('<p>hello world</p>', div.innerHTML);
      });

    });

    describe('execute(link: string)', function () {

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
        link.execute('/e');

        assert.equal('<p>h<a href="/e">e</a>llo</p>', div.innerHTML);
      });

      it('should insert an A node around word at collapsed Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello world</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 1);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var link = new LinkCommand();
        link.execute('/hello');

        assert.equal('<p><a href="/hello">hello</a> world</p>', div.innerHTML);
      });

    });

    describe('execute(range: Range)', function () {

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

        assert.equal('<p>h<a href="#">e</a>llo</p>', div.innerHTML);
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

        assert.equal('<p>foo <a href="#">bar</a> baz</p>', div.innerHTML);
      });

      it('should remove an A node around Range', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>h<a href="#">e</a>llo</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // create Range
        var range = document.createRange();
        range.setStart(div.firstChild.childNodes[1].firstChild, 0);
        range.setEnd(div.firstChild.childNodes[1].firstChild, 1);

        var link = new LinkCommand();
        link.execute(range);

        assert.equal('<p>hello</p>', div.innerHTML);
      });

      it('should remove an A node around collapsed Range', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>foo <a href="#">bar</a> baz</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // create Range
        var range = document.createRange();
        range.setStart(div.firstChild.childNodes[1].firstChild, 1);
        range.setEnd(div.firstChild.childNodes[1].firstChild, 1);
        assert(range.collapsed);

        var link = new LinkCommand();
        link.execute(range);

        assert.equal('<p>foo bar baz</p>', div.innerHTML);
      });

    });

    describe('execute(range: Range, link: string)', function () {

      it('should insert an A node around Range', function () {
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

        assert.equal('<p>h<a href="http://foo.com">ell</a>o</p>', div.innerHTML);
      });

      it('should insert an A node around word at collapsed Range', function () {
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

        assert.equal('<p><a href="http://foo.org">foo</a> bar baz</p>', div.innerHTML);
      });

    });

  });

});
