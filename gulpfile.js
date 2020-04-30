var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var append = require('gulp-append-prepend');
var less = require('gulp-less');

var features = fs.readdirSync('src').filter(function (file) {
    return fs.statSync(path.join('src', file)).isDirectory();
});

gulp.task('html', function () {
    return gulp.src('src/index.html')
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

gulp.task('javascript', function () {
    return gulp.src('src/index.js')
        .pipe(append.appendFile(features.map(f => './src/' + f + '/script.js')))
        .pipe(gulp.dest('./'));
});

gulp.task('less', function () {
    return gulp.src('./src/index.less')
        .pipe(append.appendFile(features.map(f => './src/' + f + '/style.less')))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', gulp.series('less', 'javascript', 'html'));