import fs from 'fs';

const getSize = (file = {}) => {
  return file.size;
}

const getType = (file = {}) => {
  return file.type;
}

const readBlock = (from, to) =>
  new Promise((resolve, reject) => {
    const onRead = (err, nread) => {
      if (err) {
        return reject(err);
      }

      if (nread === 0) {
        // done reading file, do any necessary finalization steps

        fs.close(fd, function(err) {
          if (err) {
            return reject(err);
          }
        });

        return;
      }

      var data;
      if (nread < CHUNK_SIZE)
        data = buffer.slice(0, nread);
      else
        data = buffer;

      resolve(data);
    };

    const onOpen = (err, fd) => {
      if (err) {
        return reject(err);
      }

      fs.read(fd, buffer, 0, CHUNK_SIZE, null, onRead);
    };

    fs.open(filePath, 'r', onOpen);
  });

export default { getSize, getType, readBlock };

