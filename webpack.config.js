const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

const outputFolder = path.resolve(__dirname, 'build')

module.exports = {
  entry: './src/server.js',
  output: {
    path: outputFolder,
    filename: 'server.js'
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
    new CleanWebpackPlugin(outputFolder, {})
  ],
  devtool: 'sourcemap'
}
