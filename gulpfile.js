var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass');

gulp.task('styles', () => {
  gulp.watch('./build/styles.scss', () => {
    return gulp.src('./build/styles.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest('./build/'));
  });
});