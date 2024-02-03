const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
    static: './dist',
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
    title: 'thisellie\'s Battleship',
    template: './src/index.html',
    favicon: './src/favicon.ico'
  })]
}