const path = require('path')

module.exports = {
	mode: 'development',
	entry: './src/index.tsx', // ваш входной файл
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'], // обязательно для css
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'], // для scss
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
