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
'use strict';

var _gitRawCommits = require('git-raw-commits');

var _gitRawCommits2 = _interopRequireDefault(_gitRawCommits);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable global-require */


describe('changelog', function () {
  beforeAll(function () {
    _gitRawCommits2.default.mockImplementation(function () {
      var stream = require('stream');
      var readable = new stream.Readable();
      readable.push('c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f\n2018-08-28T10:06:00+02:00\n:sparkles: Upgrade brand new feature\nWaouh this is awesome 2\n');
      readable.push(null);
      readable.emit('close');
      return readable;
    });
  });

  it('should generate changelog in json format', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _index.changelog)();

          case 2:
            result = _context.sent;


            expect(result).toEqual(JSON.stringify([{
              hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
              date: '2018-08-28T10:06:00+02:00',
              subject: ':sparkles: Upgrade brand new feature',
              body: 'Waouh this is awesome 2'
            }]));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});

jest.mock('git-raw-commits');
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCommit = parseCommit;
exports.parse = parse;

var _fp = require('lodash/fp');

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

function parse(commits) {
  return (0, _fp.flow)((0, _fp.split)('-hash-\n'), _fp.compact, (0, _fp.map)(parseCommit))(commits);
}
'use strict';

var _parser = require('./parser.js');

describe('commits parser', function () {
  it('should parse a single commit', function () {
    var commit = 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f\n2018-08-28T10:06:00+02:00\n:sparkles: Implements brand new feature\nWaouh this is awesome\n\n';
    expect((0, _parser.parseCommit)(commit)).toEqual({
      hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
      date: '2018-08-28T10:06:00+02:00',
      subject: ':sparkles: Implements brand new feature',
      body: 'Waouh this is awesome\n'
    });
  });

  it('should parse a single commit without a body', function () {
    var commit = 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f\n2018-08-28T10:06:00+02:00\n:sparkles: Implements brand new feature\n\n';
    expect((0, _parser.parseCommit)(commit)).toEqual({
      hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
      date: '2018-08-28T10:06:00+02:00',
      subject: ':sparkles: Implements brand new feature',
      body: ''
    });
  });

  it('should parse a single commit without a subject', function () {
    var commit = 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f\n2018-08-28T10:06:00+02:00\n\n\n';
    expect((0, _parser.parseCommit)(commit)).toEqual({
      hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
      date: '2018-08-28T10:06:00+02:00',
      subject: '',
      body: ''
    });
  });

  it('should parse multiple commits', function () {
    var commits = '-hash-\nc40ee8669ba7ea5151adc2942fa8a7fc98d9e23f\n2018-08-28T10:06:00+02:00\n:sparkles: Upgrade brand new feature\nWaouh this is awesome 2\n\n-hash-\nc40ee8669ba7ea5151adc2942fa8a7fc98d9e23d\n2018-08-28T10:05:00+02:00\n:sparkles: Implements brand new feature\nWaouh this is awesome\n\n';
    expect((0, _parser.parse)(commits)).toEqual([{
      hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23f',
      date: '2018-08-28T10:06:00+02:00',
      subject: ':sparkles: Upgrade brand new feature',
      body: 'Waouh this is awesome 2\n'
    }, {
      hash: 'c40ee8669ba7ea5151adc2942fa8a7fc98d9e23d',
      date: '2018-08-28T10:05:00+02:00',
      subject: ':sparkles: Implements brand new feature',
      body: 'Waouh this is awesome\n'
    }]);
  });
});
