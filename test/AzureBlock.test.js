/* eslint-disable import/first */
jest.mock("../src/services/Azure");
jest.mock("../src/FileUtils", () => ({
  getSize: jest.fn().mockReturnValue(50000),
  getType: jest.fn().mockReturnValue("video/mp4"),
  readBlock: jest
    .fn()
    .mockImplementation(async (file, f, t) => new ArrayBuffer(t - f)),
}));

import AzureBlock from "../src";
import { isRunningOnWeb } from "../src/app";

const { BlobStorage } = require("../src/services/Azure");

const { readBlock } = require("../src/FileUtils");

// const readAsArrayBuffer = jest.fn(function () {
//   this.result = new ArrayBuffer();
//   this.onload();
// });

// window.FileReader = jest.fn(() => ({
//   readAsArrayBuffer,
//   result: new ArrayBuffer()
// }));

const SASUrl =
  "https://myaccount.blob.core.windows.net/pictures/profile.jpg?sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d";
const file = isRunningOnWeb
  ? new File(["132456789"], "filename", { type: "video/mp4" })
  : "file_path";

describe("AzureBlock", () => {
  beforeEach(() => {
    BlobStorage.putBlock.mockReset();
    BlobStorage.putBlockList.mockReset();
    readBlock.mockReset();
  });

  describe("Creating instance", () => {
    test("it fails when url is missing", () => {
      const fn = () => new AzureBlock();
      expect(fn).toThrow();
    });

    test("it fails when file is missing", () => {
      const fn = () => new AzureBlock(SASUrl);
      expect(fn).toThrow();
    });

    test("it successfully creates an instance", () => {
      const instance = new AzureBlock(SASUrl, file);
      expect(instance instanceof AzureBlock).toBeTruthy();
    });
  });

  describe("Running the upload", () => {
    test("it reads block from file", async () => {
      const client = new AzureBlock(SASUrl, file);
      await client.upload();

      expect(readBlock).toBeCalled();
    });

    test("it calls `putBlock` method", async () => {
      expect.assertions(1);

      const client = new AzureBlock(SASUrl, file);
      await client.upload();

      expect(BlobStorage.putBlock).toBeCalledTimes(client.totalBlocks);
    });

    test("it calls `putBlockList` method", async () => {
      expect.assertions(1);

      const client = new AzureBlock(SASUrl, file);
      await client.upload();

      expect(BlobStorage.putBlockList).toBeCalledTimes(1);
    });
  });

  describe("Calling callbacks", () => {
    test("Calls `onSuccess`", async () => {
      expect.assertions(1);

      const onSuccess = jest.fn();

      const client = new AzureBlock(SASUrl, file, { callbacks: { onSuccess } });
      await client.upload();

      expect(onSuccess).toBeCalledTimes(1);
    });

    test("Calls `onError`", async () => {
      expect.assertions(2);

      const onError = jest.fn();
      readBlock.mockImplementationOnce(() => Promise.reject(new Error()));

      const client = new AzureBlock(SASUrl, file, { callbacks: { onError } });
      await expect(() => client.upload()).rejects.toThrow();

      expect(onError).toBeCalled();
    });

    test("Calls `onProgress`", async () => {
      expect.assertions(4);

      const onProgress = jest.fn();
      const client = new AzureBlock(SASUrl, file, {
        callbacks: { onProgress },
      });

      await client.upload();

      // To have called callback
      expect(onProgress).toBeCalled();

      const lastCall = onProgress.mock.calls[onProgress.mock.calls.length - 1];

      // The returned value to be an object
      expect(typeof lastCall[0]).toBe("object");

      // The returned value to contain a value called progress
      expect(Object.keys(lastCall[0])).toContain("progress");

      // The last returned progress to be 1
      expect(lastCall[0].progress).toBe(1);
    });
  });
});
