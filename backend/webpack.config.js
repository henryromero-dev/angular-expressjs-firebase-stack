const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.jsx'], 
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], 
  },
  target: 'node', 
  externals: [nodeExternals()], 
  module: {
    rules: [
        {test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader'}
    ],
  },
};