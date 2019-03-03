/*
	Tasks:

	$ gulp 			: Runs the "css" and "js" tasks.
	$ gulp watch	: Starts a watch on the "css" and "js" tasks.

*/


const { src, dest, watch, series, parallel } = require( 'gulp' );

const sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	typescript		= require( 'gulp-typescript' ),
	terser			= require( 'gulp-terser' ),
	rename 			= require( 'gulp-rename' ),
	replace			= require( 'gulp-replace' );


var inputDir 		= 'src',
	outputDir 		= 'dist';



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





const jsTranspile = ( target, module ) => {
	return src( 'src/*.ts' )

		// First, we transpile back to JS.
		.pipe( typescript({
			"target": target,
			"module": module
		}) )

		// Next, uglify it.
		.pipe( terser({ 
		    output: {
		        comments: "/^!/"
		    }
		}) );
};

/** Save plugin to be used without UMD pattern or ES6 module. */
const js = ( cb ) => {
	return jsTranspile( 'es5', 'es6' )
		.pipe( rename( 'mmenu-light.js' ) )
		.pipe( replace( 'export default mmlight;', '' ) )
		.pipe( dest( 'dist' ) )
};

/** Save plugin to be used as an ES6 module. */
const jsES6 = ( cb ) => {
	return jsTranspile( 'es6', 'es6' )
		.pipe( rename( 'mmenu-light.es6.js' ) )
		.pipe( dest( 'dist' ) );
};

/** Save plugin to be used with UMD pattern. */
const jsUMD = ( cb ) => {
	return jsTranspile( 'es5', 'umd' )
		.pipe( rename( 'mmenu-light.umd.js' ) )
		.pipe( dest( 'dist' ) );
};


/*
	$ gulp
*/
exports.default = parallel( css, js, jsES6, jsUMD );


/*
	$ gulp watch
*/
const watchTask = ( cb ) => {
	watch( inputDir + '/**/*.scss'	, css );
	watch( inputDir + '/**/*.ts'	, parallel( js, jsES6, jsUMD ) );
	cb();
};
exports.watch = watchTask;


