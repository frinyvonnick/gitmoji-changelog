'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCommit = parseCommit;

var _splitLines = require('split-lines');

var _splitLines2 = _interopRequireDefault(_splitLines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseCommit(commit) {
  const lines = (0, _splitLines2.default)(commit);
  const [hash, date, subject, ...body] = lines.splice(1, lines.length - 2);

  return {
    hash,
    date,
    subject,
    body: body.join('\n')
  };
}