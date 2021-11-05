const path = require('path');
const { readdir, stat, mkdir, rm, copyFile } = require('fs/promises');

const pathSourse = path.join(__dirname, 'files');
const pathDest = path.join(__dirname, 'files-copy');

async function copyDir(sourse, dest) {
  try {
    await clearDir(dest);
    const files = await readdir(sourse);

    files.forEach(async file => {
      const pathToCurrentSourse = path.join(sourse, file);
      const pathToCurrentDest = path.join(dest, file);
      const stats = await stat(pathToCurrentSourse);
      if (stats.isFile()) {
        await copyFile(pathToCurrentSourse, pathToCurrentDest);
      } else {
        await copyDir(pathToCurrentSourse, pathToCurrentDest);
      }
    });
  } catch (err) {
    checkError(err);
  }
}

async function clearDir(name) {
  try {
    const stats = await stat(name);
    await removeDirectory(name);
  } catch (err) {
    const log = 'err';
  } finally {
    await createDirectory(name);
  }
}

async function createDirectory(name) {
  await mkdir(name, { recursive: true }, (err) => {
    checkError(err);
  });
}

async function removeDirectory(name) {
   await rm(name, { recursive: true }, (err) => {
    checkError(err);
  });
}

function checkError(err) {
  if (err) throw err;
}

copyDir(pathSourse, pathDest);
