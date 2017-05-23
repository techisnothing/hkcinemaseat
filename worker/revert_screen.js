const fs = require('fs');
const path = require('path');
const _ = require('lodash');

if (process.argv.length < 4) {
    console.log('Usage: node revert_screen.js [brand] [cinemas]');
    process.exit();
}

const DATA_PATH = '../backend/data';
const BRAND_NAME = process.argv[2];
var cinemas = process.argv.slice(3);

const readJson = (file) => {
    if (path.extname(file) !== '.json') return null;

    const readFile = fs.readFileSync(file, 'utf8');
    return readFile ? JSON.parse(readFile) : null;
};

const revertScreen = (file) => {
    if (file && file.screenPos === 'top') {
        file.screenPos = 'bottom';
        file.rows = _.reverse(file.rows);
        _.each(file.rows, (row) => {
            row.columns = _.reverse(row.columns);
        });
        return file;
    }
};

const writeToFs = (fileName, data) => {
    fileName = fileName || "output.json";
    fs.writeFile(fileName, data, (err) => {
        console.log(`File written: ${fileName}`);
    });
};

_.each(cinemas, (cinema) => {
    const dataPath = path.resolve(__dirname, DATA_PATH, BRAND_NAME, cinema);
    fs.readdir(dataPath, (err, fileNames) => {
        if (err)
            console.error(err);

        _.each(fileNames, (file) => {
            const jsonPath = path.resolve(dataPath, file);
            var cinemaJson = readJson(jsonPath);
            cinemaJson = revertScreen(cinemaJson);
            if (cinemaJson) {
                writeToFs(jsonPath, JSON.stringify(cinemaJson, null, 2));
            }
            else {
                console.log(`Revert not required: ${file}`);
            }
        });
    });
});
