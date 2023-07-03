const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Just copy/paste html to distribution folder
function htmlTask() {
  return src('app/*.html')
    .pipe(dest('dist/'));
}

// Sass Task
function scssTask(){
  return src('app/scss/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('app/js/*.js', { sourcemaps: false })
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: './dist'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('./**/*.html', browsersyncReload);
  watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  htmlTask,
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);