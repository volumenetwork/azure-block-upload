import AzureBlockUpload from '../AzureBlockUpload';
import { Type } from './action';

/**
 * Azure Block Upload Middleware for redux
 */
const azureBlockUploadMiddleware = () => next => async action => {
  const { type, payload } = action || {};

  // If not the wanted type, ignore this middleware
  if (type !== Type) {
    return next(action);
  }
  // Required data
  const { endpoint, file, callbacks = {} } = payload || {};

  if (!endpoint) {
    throw new Error('undefined endpoint');
  }

  if (!file) {
    throw new Error('undefined file')
  }

  const client = new AzureBlockUpload(endpoint, file, { callbacks });
  await client.start();

  return next(action);
};

export default azureBlockUploadMiddleware;
