const fs = require('fs');
const path = require('path');

const mainLogDirectory = path.join(__dirname, '../Logs');
const userLogDirectory = path.join(__dirname, '../Logs/UserLogs');
const adminLogDirectory = path.join(__dirname, '../Logs/AdminLogs');

exports.writeLog = async (input, output, action, logType) => {
    let date = new Date();
    let logDirectory;

    if (!fs.existsSync(mainLogDirectory)) {
        fs.mkdirSync(mainLogDirectory);
    }

    if (logType === 'user') {
        logDirectory = userLogDirectory;
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory);
        }
    } else if (logType === 'admin') {
        logDirectory = adminLogDirectory;
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory);
        }
    } else {
        throw new Error('Invalid log type');
    }

    const fileName = path.join(
        logDirectory,
        `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}_log.txt`
    );

    // to check the structure of input and modify it accordingly
    if (input.headers && input.payload) {
        input = { headers: input.headers, payload: input.payload };
    } else if (input.headers && input.params && input.query) {
        input = { headers: input.headers, params: input.params, query: input.query };
    } else if (typeof input !== 'string' && input.headers) {
        input = { headers: input.headers, req: 'unable to log request' };
    }

    let logTime = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    let logMessage = JSON.stringify({ logTime: logTime, input: input, output: output });

    fs.appendFile(fileName, logMessage + "\n", function (err) {
        if (err) throw err;
        // console.log('Log Saved!');
    });
};