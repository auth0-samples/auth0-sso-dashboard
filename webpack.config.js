var webpack = require('webpack');
var path = require('path');

module.exports = {
  cache: true,
  context: path.join(__dirname, '/app'),
  entry: {
    app: ['./Main.js'],
    vendors: ['react', 'react-router', 'lodash', 'moment', 'react-bootstrap']
  },
  output: {
    path: path.join(__dirname, 'public/assets'),
    filename: '[name].js',
    //chunkFilename: '[name].[chunkhash].js',
    publicPath: 'assets/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      loader: 'file-loader'
    }, {
      test: /\.(png|jpg|svg)$/,
      loader: 'url-loader?limit=8192'
    }],
    noParse: [/\.min\.js/]
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
      __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
      __SITE_TITLE__: JSON.stringify(process.env.SITE_TITLE),
      __LOGO_URL__: JSON.stringify(process.env.LOGO_URL),
      __AUTH0_DOMAIN__: JSON.stringify(process.env.AUTH0_DOMAIN),
      __AUTH0_CLIENT_ID__: JSON.stringify(process.env.AUTH0_CLIENT_ID),
      __AUTH0_CONNECTION__: JSON.stringify(process.env.AUTH0_CONNECTION),
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
};
