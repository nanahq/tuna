const { getDefaultConfig } = require('expo/metro-config')
const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.extraNodeModules.stream = require.resolve('stream-browserify')
// defaultConfig.resolver.sourceExts =  ['jsx','js','ts','tsx'] //add here

module.exports = defaultConfig
