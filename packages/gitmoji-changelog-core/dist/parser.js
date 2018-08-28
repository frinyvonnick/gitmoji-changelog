'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCommit = parseCommit;

var _splitLines = require('split-lines');

var _splitLines2 = _interopRequireDefault(_splitLines);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function parseCommit(commit) {
  var lines = (0, _splitLines2.default)(commit);

  var _lines$splice = lines.splice(0, lines.length - 1),
      _lines$splice2 = _toArray(_lines$splice),
      hash = _lines$splice2[0],
      date = _lines$splice2[1],
      subject = _lines$splice2[2],
      body = _lines$splice2.slice(3);

  return {
    hash: hash,
    date: date,
    subject: subject,
    body: body.join('\n')
  };
}