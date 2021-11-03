const path = require('path');
const fs = require("fs");
const BitePerKiloBite = 1024;

const pathToDirectory = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDirectory, (err, files) => {
  if (err) {
    console.log(err);
  }
  files.forEach(file => {
    const pathToFile = path.join(pathToDirectory, file);
    fs.stat(pathToFile, function(err, stats) {
      if (err) {
        console.log(err);
      }
      if (stats.isFile()) {
        const name = path.basename(file, path.extname(file));
        const ext = path.extname(file).substr(1);
        const size = Math.round(stats.size * 100 / BitePerKiloBite) / 100;
        const fileInfo =  `${name} - ${ext} - ${size}kb`;
        console.log(fileInfo);
      }
    });
  });
})
