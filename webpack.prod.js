const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: `${__dirname}/dist`,
    clean: true
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['css-loader']
    }]
  },
  plugins: [new HtmlWebpackPlugin()]
}