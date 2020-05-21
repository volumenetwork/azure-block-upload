const isRunningOnWeb = () => !!FileReader;

export default isRunningOnWeb() ? require('./FileUtils.web') : require('./FileUtils.node');
