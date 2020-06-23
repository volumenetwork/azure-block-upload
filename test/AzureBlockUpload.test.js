/* eslint-disable import/first */
jest.mock('../src/services/Azure');
jest.mock('../src/FileUtils', () => ({
  getSize: jest.fn().mockReturnValue(50000),
  getType: jest.fn().mockReturnValue('video/mp4'),
  readBlock: jest.fn().mockImplementation(async (file, f, t) => new ArrayBuffer(t - f)),
}));

import AzureBlockUpload from '../src';
import { isRunningOnWeb } from '../src/app';

const { BlobStorage } = require('../src/services/Azure');

const { readBlock } = require('../src/FileUtils');

// const readAsArrayBuffer = jest.fn(function () {
//   this.result = new ArrayBuffer();
//   this.onload();
// });

// window.FileReader = jest.fn(() => ({
//   readAsArrayBuffer,
//   result: new ArrayBuffer()
// }));

const SASUrl = 'https://myaccount.blob.core.windows.net/pictures/profile.jpg?sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d';
const file = isRunningOnWeb ? new File(['132456789'], 'filename', { type: 'video/mp4' }) : 'file_path';

describe('AzureBlockUpload', () => {
  beforeEach(() => {
    BlobStorage.putBlock.mockReset();
    BlobStorage.putBlockList.mockReset();
    readBlock.mockReset();
  });

  describe('Creating instance', () => {
    test('it fails when url is missing', () => {
      const fn = () => new AzureBlockUpload();
      expect(fn).toThrow();
    });

    test('it fails when file is missing', () => {
      const fn = () => new AzureBlockUpload(SASUrl);
      expect(fn).toThrow();
    });

    test('it successfully creates an instance', () => {
      const instance = new AzureBlockUpload(SASUrl, file);
      expect(instance instanceof AzureBlockUpload).toBeTruthy();
    });
  });

  describe('Running the upload', () => {
    test('it reads block from file', async () => {
      const client = new AzureBlockUpload(SASUrl, file);
      await client.start();

      expect(readBlock).toBeCalled();
    });

    test('it calls `putBlock` method', async () => {
      expect.assertions(1);

      const client = new AzureBlockUpload(SASUrl, file);
      await client.start();

      expect(BlobStorage.putBlock).toBeCalledTimes(client.totalBlocks);
    });

    test('it calls `putBlockList` method', async () => {
      expect.assertions(1);

      const client = new AzureBlockUpload(SASUrl, file);
      await client.start();

      expect(BlobStorage.putBlockList).toBeCalledTimes(1);
    });
  });

  describe('Calling callbacks', () => {
    test('Calls `onSuccess`', async () => {
      expect.assertions(1);

      const onSuccess = jest.fn();

      const client = new AzureBlockUpload(SASUrl, file, { callbacks: { onSuccess } });
      await client.start();

      expect(onSuccess).toBeCalledTimes(1);
    });

    test('Calls `onError`', async () => {
      expect.assertions(2);

      const onError = jest.fn();
      readBlock.mockImplementationOnce(() => Promise.reject(new Error()));

      const client = new AzureBlockUpload(SASUrl, file, { callbacks: { onError } });
      await expect(() => client.start()).rejects.toThrow();

      expect(onError).toBeCalled();
    });

    test('Calls `onProgress`', async () => {
      expect.assertions(4);

      const onProgress = jest.fn();
      const client = new AzureBlockUpload(SASUrl, file, { callbacks: { onProgress } });

      await client.start();

      // To have called callback
      expect(onProgress).toBeCalled();

      const lastCall = onProgress.mock.calls[onProgress.mock.calls.length - 1];

      // The returned value to be an object
      expect(typeof lastCall[0]).toBe('object');

      // The returned value to contain a value called progress
      expect(Object.keys(lastCall[0])).toContain('progress');

      // The last returned progress to be 1
      expect(lastCall[0].progress).toBe(1);
    });
  });
});
