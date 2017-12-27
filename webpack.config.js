const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: {
		'draw.js': './src/index.ts',
		// 'cell': './src/model/cell.ts'

		// for __test__
		'__test__/rect/index.js': './src/__test__/rect/index.js'
	},
	output: {
		filename: '[name]',
		path: path.resolve( __dirname, 'dist' )
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: {
			model: path.resolve( __dirname, './src/model' ),
			shape: path.resolve( __dirname, './src/shape' ),
			util: path.resolve( __dirname, './src/util' ),
		},
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		],
	},
	plugins: [
		new CleanWebpackPlugin( [ 'dist' ] ),
		new CopyWebpackPlugin( [
			{
				from: './src/__test__',
				to: '__test__'
			}
		] )
	]

};
