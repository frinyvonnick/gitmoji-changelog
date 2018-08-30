'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = convert;
function convert(json) {
  const commits = JSON.parse(json);

  return commits.reduce((markdown, commit) => {
    return `${markdown}- ${commit.subject} (${commit.hash})\n`;
  }, '# Changelog\n\n');
}