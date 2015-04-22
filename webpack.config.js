var webpack = require('webpack');
var path = require('path');
require('dotenv').load();

module.exports = {
    cache: true,
    context: path.join(__dirname, '/app'),
    entry: {
        app: [
             'webpack-dev-server/client?http://localhost:3000/',
            './Main.js'
        ],
        vendors: ['react', 'react-router', 'lodash', 'moment', 'react-bootstrap']
    },
    output: {
        path: path.join(__dirname, 'dist/app/assets'),
        filename: '[name].js',
        //chunkFilename: '[name].[chunkhash].js',
        publicPath: 'assets/'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&minetype=application/font-woff' },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&minetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&minetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&minetype=image/svg+xml' },
            { test: /\.png$/, loader: 'url-loader?mimetype=image/png' }
        ],
        noParse: [/\.min\.js/]
    },
    resolve: {
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
          __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
          __SITE_TITLE__: JSON.stringify(process.env.SITE_TITLE),
          __LOGO_URL__: JSON.stringify(process.env.LOGO_URL),
          __AUTH0_DOMAIN__: JSON.stringify(process.env.AUTH0_DOMAIN),
          __AUTH0_CLIENT_ID__: JSON.stringify(process.env.AUTH0_CLIENT_ID),
          __AUTH0_CONNECTION__: JSON.stringify(process.env.AUTH0_CONNECTION),
          __AWS_S3_BUCKET__: JSON.stringify(process.env.AWS_S3_BUCKET),
          __AWS_IAM_PRINCIPAL__: JSON.stringify(process.env.AWS_IAM_PRINCIPAL),
          __AWS_IAM_USER__: JSON.stringify(process.env.AWS_IAM_USER),
          __AWS_IAM_ADMIN__: JSON.stringify(process.env.AWS_IAM_ADMIN)
        }),
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ]
};
