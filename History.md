
1.2.3 / 2014-10-30
==================

 * package: update "range-insert-node" to v1.0.3
 * package: allow any "debug" v2

1.2.2 / 2014-10-03
==================

 * index: fix failing Opera tests
 * index: add variable type information in `queryState()`

1.2.1 / 2014-10-03
==================

 * index: handle backwards selections
 * index: use "node-contains"
 * index: don't modify the Selection in `queryEnabled()`

1.2.0 / 2014-09-12
==================

 * index: insert a "Link" text node upon a collapsed Range

1.1.1 / 2014-09-07
==================

 * index: fix failing `queryEnabled()` tests
 * test: add the `queryEnabled()` tests

1.1.0 / 2014-09-06
==================

 * index: add `void` return statement to copyRange()
 * index: add `Node#contains()` polyfill
 * index: use "dom-iterator" to implement `queryState()`
 * test: add Selection still cleared assertions
 * test: add `queryState()` tests

1.0.1 / 2014-09-05
==================

 * test: fix failing IE test by working around non-standard "unlink" behavior
 * test: add comments
 * index: fix the native Selection after execute() when no Range was passed in
 * index: transfer the unwrap-node Range

1.0.0 / 2014-09-04
==================

 * add README.md file
 * test: enable Travis-CI + Saucelabs testing
 * test: add execute() "unlink" tests
 * index: fix passing link to a collapsed selection
 * initial tests
 * initial commit
