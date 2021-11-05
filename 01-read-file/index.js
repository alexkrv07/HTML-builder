const { open } = require('fs/promises');
const path = require('path');

async function readfile() {
  const pathToTextFile = path.join(__dirname, 'text.txt');

  let filehandle;
  try {
    filehandle = await open(pathToTextFile);
    const text = await filehandle.readFile('utf8');

    console.log(text);
  } finally {
    await filehandle?.close();
  }
}

readfile();
