
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
