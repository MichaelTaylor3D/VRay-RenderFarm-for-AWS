const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./aws-config.json');

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const config = require('./config.json');

const uploadParams = {Bucket: config.s3Bucket, Key: '', Body: ''};

exports.uploadFile = async (filepath, {username}) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filepath);
    fileStream.on('error', (err) => reject(error))
    uploadParams.Body = fileStream;
    uploadParams.Key = `${username}/${path.basename(filepath)}`;
    s3.upload(uploadParams).promise().then((error, data) => {
      if (error) reject(error);
      if (data) {
        const location = _.cloneDeep(data.Location)
        console.log("Upload Success", location);
        resolve(location);
      }
    });
  });
}