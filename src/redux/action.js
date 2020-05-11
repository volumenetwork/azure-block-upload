export const Type = '@@AZURE_BLOCK_UPLOAD';

/**
 * Redux action to upload a file to Azure Blob Storage by using a sas url
 * @param {String} sasUrl
 * @param {File} file
 * @param {Object} callbacks
 * @param {Function} callbacks.onError
 * @param {Function} callbacks.onProgress
 * @param {Function} callbacks.onSuccess
 */
const azureBlockUploadAction = (sasUrl, file, callbacks = {}) => ({
  type: Type,
  payload: { endpoint: sasUrl, file, callbacks },
});

export default azureBlockUploadAction;
