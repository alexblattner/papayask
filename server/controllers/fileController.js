const File = require('../models/file');

exports.create = async (file, type, userId) => {
  const body = {
    name: file,
    type,
    owner: userId,
  };
  try {
    const newFile = await File.create(body);
    return newFile;
  } catch (e) {
    console.log(e);
  }
};
