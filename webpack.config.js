  const path = require('path')

	module.exports = {
		mode: 'development',
		entry: './src/index.tsx',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.(js|jsx)$/,
					use: 'babel-loader',
					exclude: /node_modules/,
				},
			],
		},
		devtool: 'inline-source-map',
		devServer: {
			static: path.resolve(__dirname, 'public'),
			historyApiFallback: true,
			hot: true,
			port: 3000,
		},
	}
