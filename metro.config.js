/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const np = require('node:process');

// Used to test local changes
const packagePath = np.cwd() + '/../react-native-tapresearch';
module.exports = {
  resolver: {
    nodeModulesPaths: [
      np.cwd() + 'ios',
      packagePath,
      np.cwd() + '/node_modules',
    ],
  },
  watchFolders: [packagePath],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
