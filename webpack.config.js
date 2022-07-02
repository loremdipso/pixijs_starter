const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const isDev = process.env.NODE_ENV !== 'production';

const config = {
	mode: isDev ? 'development' : 'production',
	entry: './src/scripts/app.ts',
	output: {
		path: path.resolve(__dirname, 'docs'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/inline'
			},
			{
				test: /\.(css|scss)$/,
					use: [
						{
							loader: 'style-loader',
							options: { 
								insert: 'head', // insert style tag inside of <head>
								injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
							},
						},
						"css-loader",
						"sass-loader"
					],
			},
		]
	},
	plugins: [
		...(isDev ? [] : [new BundleAnalyzerPlugin({
				analyzerMode: 'static',
				openAnalyzer: false,
				reportFilename: '../report.html'
		})]),
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{ from: 'src/index.html' },
				// { from: 'src/css/style.css', to: 'css/' },
				// { from: 'src/images/*', to: 'images/' },
			]
		}),
		new DefinePlugin({
			IS_DEBUG: JSON.stringify(isDev),
		}),
	],
	devServer: {
		compress: true,
		historyApiFallback: true,
		port: 8080,
		hot: true
	},
	optimization: {
		minimize: !isDev
	}
};

if (isDev) {
	config.devtool = 'eval-source-map';
}

module.exports = config;
