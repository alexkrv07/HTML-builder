const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const pathToTextFile = path.join(__dirname, 'text.txt');

let readableStream = fs.createReadStream(
  pathToTextFile,
  'utf8'
);

readableStream.pipe(stdout);
