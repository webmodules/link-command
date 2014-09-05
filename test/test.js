
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

        // test that we have the expected HTML at this point
        assert.equal('<p>h<a href="#">e</a>llo</p>', div.innerHTML);

        // test that the current Selection contains the A inner text
        sel = window.getSelection();
        assert.equal('e', sel.getRangeAt(0).toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>hello <a href="#">world</a></p>', div.innerHTML);

        // test that the current Selection contains the A inner text
        sel = window.getSelection();
        assert.equal('world', sel.getRangeAt(0).toString());
      });

      it('should remove an A node around current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hel<a href="#">lo world</a></p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.lastChild.lastChild.firstChild, 0);
        range.setEnd(div.lastChild.lastChild.firstChild, 8);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var link = new LinkCommand();
        link.execute();

        // test that we have the expected HTML at this point
        assert.equal('<p>hello world</p>', div.innerHTML);

        // test that the current Selection contains text that was in the A
        sel = window.getSelection();
        assert.equal('lo world', sel.getRangeAt(0).toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>hello world</p>', div.innerHTML);

        // test that the current Selection contains text that was in the A
        sel = window.getSelection();
        assert.equal('lo world', sel.getRangeAt(0).toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>h<a href="/e">e</a>llo</p>', div.innerHTML);

        // test that the current Selection contains the A inner text
        sel = window.getSelection();
        assert.equal('e', sel.getRangeAt(0).toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p><a href="/hello">hello</a> world</p>', div.innerHTML);

        // test that the current Selection contains the A inner text
        sel = window.getSelection();
        assert.equal('hello', sel.getRangeAt(0).toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>h<a href="#">e</a>llo</p>', div.innerHTML);

        // test that the Range contains the A inner text
        assert.equal('e', range.toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>foo <a href="#">bar</a> baz</p>', div.innerHTML);

        // test that the Range contains the A inner text
        assert.equal('bar', range.toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>hello</p>', div.innerHTML);

        // test that the Range contains the text where the A used to be
        assert.equal('e', range.toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>foo bar baz</p>', div.innerHTML);

        // test that the Range contains the text where the A used to be
        assert.equal('bar', range.toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p>h<a href="http://foo.com">ell</a>o</p>', div.innerHTML);

        // test that the Range contains the A inner text
        assert.equal('ell', range.toString());
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

        // test that we have the expected HTML at this point
        assert.equal('<p><a href="http://foo.org">foo</a> bar baz</p>', div.innerHTML);

        // test that the Range contains the A inner text
        assert.equal('foo', range.toString());
      });

    });

  });

});
