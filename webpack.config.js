const path = require('path');

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
		{
			test: /\.css$/,
			use: [{loader: "style-loader"}, {loader: "css-loader"}]
		}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist")
	}
};