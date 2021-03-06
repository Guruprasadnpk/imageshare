const path = require('path');
const slsw = require('serverless-webpack');
// var nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    // externals: [nodeExternals()],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    externals: {'sharp': '/opt/node_modules/sharp'},
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/, 
                use: {
                    loader: 'awesome-typescript-loader',
                    options: { configFileName: 'tsconfig.json' }
                },
                exclude: /node_modules/ 
            },
            {
                test: /\.(sass|less|css)$/,
                loaders: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.node$/,
                loader: 'node-loader',
            }
        ],
    },
};