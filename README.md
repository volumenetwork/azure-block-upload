# azure-block-upload

A simple client to upload large files to Azure Blob Storage using SAS authentication

## Installation

```
npm install azure-block-upload
```

## Usage

To upload a file to Azure Blob Storage using this module, just import it, create a new instance with the needed parameters, and call the `upload` method.

```
import AzureBlockUpload from 'azure-block-upload';

const client = new AzureBlockUpload(sasurl, file, options);
await client.start();
```

### sasUrl

This is the azure presigned sas url for uploading. It should be similar to `https://myaccount.blob.core.windows.net/pictures/profile.jpg?sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d`. See [this page](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview) for more information.

### file

A _File_ instance, the file to be uploaded

### options

An optional object that can include the following values:

#### options.blockIDPrefix

The prefix to be used in the block ids. By default is _block_. Block ids are encoded in base-64, so if using another value, the change won't be explicitly visible.

#### options.blockSize

Block size. By default it's 4MB, as this is Azure's limit for block uploading.

#### options.callbacks

An object with three callbacks: _onSuccess_, _onError_, _onProgress_

##### options.callbacks.onSuccess

To be called when the file is completely uploaded

##### options.callbacks.onError

To be called when the upload fails

##### options.callbacks.onProgress

To be called everytime the upload progress is updated. It reveices the following argument:

```
{
  "progress": 0.5 // This is a number between 0 and 1
}
```

#### options.simultaneousUploads

How many block will be uploaded at the same time. Default value is 3.
