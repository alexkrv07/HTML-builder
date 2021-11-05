const path = require('path');
const { open } = require('fs/promises');
const readline = require('readline');
const process = require('process');

const WELCOME_PHRASE = 'Enter text to write file, each part will be added to created file "text.txt":  \n';
const BYE_PHRASE = 'Thank you. Application is close. Good luck!';
const EXIT = 'exit';
const pathToTextFile = path.join(__dirname, 'text.txt');

const stdout = process.stdout;
const input = process.stdin;
stdout.write(WELCOME_PHRASE);

async function writeFile() {
  const filehandle = await open(pathToTextFile, 'w' );
  const writableStream = filehandle.createWriteStream();

  const rl = readline.createInterface({ input, writableStream });

  rl.on('line', (line) => {
    const textLine = line.toString();
    if (textLine.trim() === EXIT) {
      process.exit();
    }
    writableStream.write(textLine + '\n');
  });

  process.on('exit', () => {
    stdout.write(BYE_PHRASE);
  });

  process.on('SIGINT', () => {
    process.exit();
  });
}

writeFile();
