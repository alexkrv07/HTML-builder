const path = require('path');
const { open, readdir, stat, mkdir, rmdir, copyFile } = require('fs/promises');

const startTemplate = '{{';
const endTemplate = '}}';
const outputDir = 'project-dist';
const assets = 'assets';
const pathAssetsSourse = path.join(__dirname, assets);
const pathAssetsDest = path.join(__dirname, outputDir, assets);

const pathToBaseTemplate = path.join(__dirname, 'template.html');
const pathToDest = path.join(__dirname, outputDir);
const arrayOfTags = [];
const contentOfTags = {};
const extCSS = 'css';

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

async function mergeStyles() {
  try {
    const pathSourseStyles = path.join(__dirname, 'styles');
    const pathDestStyles = path.join(__dirname, 'project-dist', 'style.css');

    const arrayOfCSS = await createArrayFromDir(pathSourseStyles);
    const mergedStyles = arrayOfCSS.join('\n');
    const fileWritehandle = await open(pathDestStyles, 'w');
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

async function createHtmlFromTemplate() {
  try {

    const fileReadhandle = await open(pathToBaseTemplate);
    let baseTemplate = await fileReadhandle.readFile('utf8');
    addTagToArray(baseTemplate, arrayOfTags);
    const pathToComponents = path.join(__dirname, 'components');
    await readContentTags(pathToComponents);
    baseTemplate = replaceTagToContent(baseTemplate);
    const pathToIndexHtml = path.join(pathToDest, 'index.html');
    createFile(pathToIndexHtml, baseTemplate);

  } catch (err) {
    checkError(err);
  }
}

function addTagToArray(str, array) {

  let startIndex = 0;
  const length = str.length;

  while (startIndex >= 0 && startIndex < length - 1) {
    startIndex = str.indexOf(startTemplate, startIndex);
    if (startIndex > 0) {
      const endIndex = str.indexOf(endTemplate, startIndex);
      if (endIndex > 0) {
        const TAG = str.slice(startIndex + 2, endIndex);
        array.push(TAG);
      }
      startIndex = endIndex + endTemplate.length;
    }
  }

}

async function readContentTags(dirName) {
  try {
    for (let i = 0; i < arrayOfTags.length; i++ ) {
      const pathToTagFile = path.join(dirName, arrayOfTags[i] + '.html');
      const fileReadhandle = await open(pathToTagFile);
      const tagContent = await fileReadhandle.readFile('utf8');
      contentOfTags[arrayOfTags[i]] = tagContent;
    }
  } catch (err) {
    checkError(err);
  }
}

function replaceTagToContent(str) {

  for (let i = 0; i < arrayOfTags.length; i++ ) {
    str = str.replaceAll(
      `${startTemplate}${arrayOfTags[i]}${endTemplate}`,
      contentOfTags[arrayOfTags[i]]
    );
  }
  return str;
}

async function createFile(pathToFile, content) {
  const fileWritehandle = await open(pathToFile, 'w');
  await fileWritehandle.writeFile( content);
}

copyDir(pathAssetsSourse, pathAssetsDest);
mergeStyles();
createHtmlFromTemplate();
