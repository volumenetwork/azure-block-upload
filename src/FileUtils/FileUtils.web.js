const getSize = (file = {}) => file.size;

const getType = (file = {}) => file.type;

const readBlock = (from, to) => new Promise(
  (resolve, reject) => {
    const reader = new FileReader();

    // Get partial file
    const slicedFile = this.file.slice(from, to);

    reader.onabort = () => reject(new Error('Reading aborted'));
    reader.onerror = () => reject(new Error('file reading has failed'));
    reader.onload = () => {
      const arrayBuffer = reader.result;
      resolve(arrayBuffer);
    };
    reader.readAsArrayBuffer(slicedFile);
  }
);

export default { getSize, getType, readBlock };
