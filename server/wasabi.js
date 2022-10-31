const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const aws=require('aws-sdk');
const bucketName = process.env.WASABI_BUCKET_NAME;
const region = process.env.WASABI_REGION;
const accessKeyId =process.env.WASABI_ACCESS_ID;
const secretAccessKey = process.env.WASABI_ACCESS_KEY;
const wasabiEndpoint = new aws.Endpoint('s3.wasabisys.com');
const s3 = new S3({
  endpoint: wasabiEndpoint,
  region: region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

function deleteFile(file) {
  s3.deleteObject({
    Bucket: bucketName,
    Key: file
  },function (err,data){
    return data
  })
}
exports.deleteFile = deleteFile

// downloads a file from s3
function getFileStream(fileKey) {

  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream
function copy(filename,newname){
  console.log(s3.copyObject({
    Bucket:bucketName,
    CopySource:(bucketName+"/"+filename),
    Key:newname
  }))
}
exports.copy=copy
exports.s3=s3
