const webpack = require('webpack');

module.exports = function override(config, env) {
  // Provide fallbacks for Node.js core modules to make them work in the browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert/'),
    process: require.resolve('process/browser'),
    path: require.resolve('path-browserify'),
    fs: false, // 'fs' is not available in the browser
  };

  // Provide global variables for Buffer and process
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser', // Directly use 'process/browser' string
    }),
  ]);

  // Setup resolve alias
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': 'process/browser.js',
  };

  // Ignore some common warnings during build (optional)
  config.ignoreWarnings = [
    /Failed to parse source map/,
    /Module not found: Error: Can't resolve 'process\/browser'/,
    /Cannot read properties of undefined \(reading 'module'\)/,
    /Conflicting values for 'process\.env'/,
    /no-unused-vars/,
    /react-hooks\/exhaustive-deps/,
    /import\/no-anonymous-default-export/,
  ];

  return config;
};