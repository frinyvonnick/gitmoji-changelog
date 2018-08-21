'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = transform;
function transform() {
  return 'Hello';
}
'use strict';

var _index = require('./index.js');

describe('transform', function () {
  it('should works', function () {
    expect((0, _index.transform)()).toEqual('Hello');
  });
});
