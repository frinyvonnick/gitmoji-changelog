'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changelog = changelog;

var _parser = require('./parser');

Object.keys(_parser).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _parser[key];
    }
  });
});

var _gitRawCommits = require('git-raw-commits');

var _gitRawCommits2 = _interopRequireDefault(_gitRawCommits);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _concatStream = require('concat-stream');

var _concatStream2 = _interopRequireDefault(_concatStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMIT_FORMAT = '%n%H%n%cI%n%s%n%b';

function changelog() {
  return new Promise(function (resolve) {
    (0, _gitRawCommits2.default)({
      format: COMMIT_FORMAT
    }).pipe(_through2.default.obj(function (data, enc, next) {
      next(null, (0, _parser.parseCommit)(data.toString()));
    })).pipe((0, _concatStream2.default)(function (data) {
      resolve(JSON.stringify(data));
    }));
  });
}