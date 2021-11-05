const path = require('path');
const { open, readdir, stat } = require('fs/promises');

const pathSourse = path.join(__dirname, 'styles');
const pathDest = path.join(__dirname, 'project-dist', 'bundle.css');
const extCSS = 'css';

async function mergeStyles() {
  try {
    const arrayOfCSS = await createArrayFromDir(pathSourse);
    const mergedStyles = arrayOfCSS.join('\n');
    const fileWritehandle = await open(pathDest, 'w');
    fileWritehandle.writeFile(mergedStyles);
  } catch (err) {
    checkError(err);
  }
}

async function createArrayFromDir(dir) {
  const result = [];
  try {
    const files = await readdir(dir);
    for (let i = 0; i < files.length; i++) {
      const pathToSourseFile = path.join(dir, files[i]);
      const stats = await stat(pathToSourseFile);
      if (stats.isFile()) {
        const ext = path.extname(files[i]).substr(1);
        if (ext === extCSS) {
          let fileReadhandle = await open(pathToSourseFile);
          const text = await fileReadhandle.readFile('utf8');
          result.push(text);
        }
      }
    }
    return result;

  } catch (err) {
    checkError(err);
  }
}

function checkError(err) {
  if (err) throw err;
}

mergeStyles();
