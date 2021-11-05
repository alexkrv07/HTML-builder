const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const stdout = process.stdout;
const input = process.stdin;
const WELCOME_PHRASE = 'Enter text to write file, each part will be added to created file "text.txt": \n';
const BYE_PHRASE = 'Thank you. Application is close. Good luck!';

const EXIT = 'exit';
const pathToTextFile = path.join(__dirname, 'text.txt');
const writableStream = fs.createWriteStream(pathToTextFile);
const rl = readline.createInterface({ input, writableStream });

stdout.write(WELCOME_PHRASE);

rl.on('line', (line) => {
  const textLine = line.toString();
  if (textLine.trim() === EXIT) {

    process.exit();

  }
  writableStream.write(textLine + '\n');
});

process.on('exit', () => stdout.write(BYE_PHRASE));
process.on('SIGINT', () => {
  process.exit();
});
