const path = require('path');

module.exports = {
	context: __dirname,

	entry: {
		main: './src/main.ts'
	},

	output: {
		filename: '[name].bundle.js',
		path: path.join(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.ts', '.html', '.css'],
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules'
		]
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				use: 'ts-loader'
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: 'html-loader'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: 'css-loader'
			}
		]
	}
};