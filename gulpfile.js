var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var less = require('gulp-less');

var features = fs.readdirSync('src').filter(function (file) {
    return fs.statSync(path.join('src', file)).isDirectory();
});

gulp.task('fileinclude', function () {
    return gulp.src(['src/index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true,
            context: {
                features: features
            }
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('less', function () {
    return gulp.src('./src/index.less')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true,
            context: {
                features: features
            }
        }))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', gulp.parallel('fileinclude', 'less'));