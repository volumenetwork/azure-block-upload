import { BlobStorage } from "./services/Azure";

class AzureBlockDownload {
  /**
   * @param {String} url Where to download the file
   *
   */
  constructor(url) {
    if (typeof url !== "string") {
      throw new Error("url must be a string");
    }

    this.url = url;
  }

  /**
   * Start uploading
   */
  async start(dataEncryptionKey, range) {
    return BlobStorage.getBlock(this.url, range).then((response) => {
      return response.data;
    });
  }
}

export default AzureBlockDownload;
