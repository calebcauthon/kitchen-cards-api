var gulp = require('gulp');
var child = require('child_process');

gulp.task('server', function() {
  var server = child.spawn('node', ['./bin/www']);
});

gulp.task('mongo', function() {
  var server = child.spawn('mongod', ['--dbpath', '/usr/local/var/mongodb']);
});

gulp.task('js', function() {
  return gulp.src("bower_components/k-cards-js/services.js")
    .pipe(gulp.dest("public/javascripts/app"))
});

