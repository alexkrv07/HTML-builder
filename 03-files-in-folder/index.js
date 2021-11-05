const path = require('path');
const { readdir, stat } = require('fs/promises');
const BitePerKiloBite = 1024;
const pathToDirectory = path.join(__dirname, 'secret-folder');

async function readDirectory(pathToDir) {
  try {
    const files = await readdir(pathToDir);

    files.forEach(async file => {
      const pathToFile = path.join(pathToDir, file);
      const stats = await stat(pathToFile);
      if (stats.isFile()) {
        const name = path.basename(file, path.extname(file));
        const ext = path.extname(file).substr(1);
        const size = Math.round(stats.size * 1000 / BitePerKiloBite) / 1000;
        const fileInfo =  `${name} - ${ext} - ${size}kb`;
        console.log(fileInfo);
      }
    });

  } catch (err) {
    console.error(err);
  }
}

readDirectory(pathToDirectory);
