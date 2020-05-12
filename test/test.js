import AzureBlockUpload from '../src';

describe('AzureBlockUpload', function() {
  describe('Creating instance', function() {
    test('it fails when url is missing', function() {
      const fn = () => new AzureBlockUpload();
      expect(fn).toThrow();
    });

    test('it fails when file is missing', function() {
      const fn = () => new AzureBlockUpload('http:localhost');
      expect(fn).toThrow();
    });

    test('it successfully creates an instance', function() {
      const file = new Blob([""], { type: 'video/mp4' });
      const instance = new AzureBlockUpload('http:localhost', file);
      expect(instance).tobeTruthy(instance instanceof AzureBlockUpload);
    });
  });
});