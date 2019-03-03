/*
	Tasks:

	$ gulp 			: Runs the "css" and "js" tasks.
	$ gulp watch	: Starts a watch on the "css" and "js" tasks.

*/


const { src, dest, watch, series, parallel } = require( 'gulp' );

const sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	typescript		= require( 'gulp-typescript' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	binDir			= 'bin';



/*
	CSS tasks.
*/
const css = () => {
	return src( inputDir + '/**/*.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( dest( outputDir ) );
};



/*
	JS tasks.
*/
const js = () => {
	return src( inputDir + '/**/*.ts' )
  		.pipe( typescript({
			"target": "es6",
			"module": "es6"
  		}) )
		.pipe( dest( outputDir ) );
};


/*
	$ gulp
*/
const defaultTask = parallel( js, css );
exports.default = defaultTask;


/*
	$ gulp watch
*/
const watchTask = ( cb ) => {
	watch( inputDir + '/**/*.scss'	, css );
	watch( inputDir + '/**/*.ts'	, js );
	cb();
};
exports.watch = watchTask;
