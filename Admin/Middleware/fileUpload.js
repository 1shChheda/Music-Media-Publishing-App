const { createDirectories } = require('./createDirectory');
const path = require('path');

exports.singleFileUpload = async (filePath, file) => {
    return new Promise((resolve, reject) => {
        createDirectories(path.dirname(filePath)); // Create directories recursively if they don't exist
        file.mv(filePath, (err) => {
            if (err) {
                console.log(err);
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
};

exports.uploadFile = async (object, userId, addPath, hostname) => {
    try {
        const filename = path.basename(object.name);
        const uploadDir = path.join('Upload', userId.toString(), addPath);
        const filePath = path.join(uploadDir, filename);
        const fileUrl = `http://${hostname}/${filePath}`;

        await this.singleFileUpload(filePath, object);

        return [true, { filePath, url: fileUrl }];
    } catch (error) {
        return [false, error];
    }
};