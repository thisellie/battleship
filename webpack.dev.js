const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
    static: './src',
    port: 9000,
    open: true
  },
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist`,
    clean: true
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    title: 'Battleship',
    template: './src/index.html',
    favicon: './src/favicon.ico'
  }), new HtmlWebpackHarddiskPlugin()]
}