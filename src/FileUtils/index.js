/* eslint-disable global-require */
const isRunningOnWeb = () => !!FileReader;

module.exports = isRunningOnWeb() ? require('./FileUtils.web') : require('./FileUtils.node');
