/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const np = require('node:process');
module.exports = {
  resolver: {
    nodeModulesPaths: [
      np.cwd() + 'ios',
      np.cwd() + 'android',
      np.cwd() + '/node_modules',
    ],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
