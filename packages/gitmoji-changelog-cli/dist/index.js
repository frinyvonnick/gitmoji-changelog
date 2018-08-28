#! /usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = main;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _core = require('@gitmoji-changelog/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function main() {
  try {
    const changes = await (0, _core.changelog)();
    _fs2.default.writeFileSync('./CHANGELOG.json', changes);
  } catch (e) {
    console.error('Cannot find a git repository in current path.');
  }
}

main();