var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    uncss = require('gulp-uncss'),
    concat = require('gulp-concat'),
    uglyfly = require('gulp-uglyfly'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    server = require('gulp-server-livereload'),
    cache = require('gulp-cache'),
    browsersync = require('browser-sync'),
    watch = require('gulp-watch'),
    cssnano = require('gulp-cssnano');
 

//Компиляция Sass
gulp.task('sass', ['clean-css'], function () {
    return gulp.src('./src/assets/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        //.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./src/assets/css'));
});


gulp.task('sassrtl', ['clean-cssrtl'], function () {
      return gulp.src('./src/assets/sassrtl/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/assets/css'));
});


gulp.task('mincss', ['sass'], function () {
    return gulp.src(['./src/assets/css/*.css', '!./src/assets/css/rtl.css'])
        .pipe(concatCss("bundle.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename("bundle.min.css"))
        .pipe(cssnano())
    
    .pipe(gulp.dest('./src/assets/css'));
});




//Проставление префиксов для кроссбраузерности 
gulp.task('autoprefix', ['mincss'], function () {
    return gulp.src('./src/assets/css/**/*.css')
    
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
    
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src/assets/css'));
});

//Минимизация JS
gulp.task('scripts', function() {
    return gulp.src('./src/assets/js/*.js')
    //.pipe(concat('script.js'))
    //.pipe(uglyfly())
    .pipe(gulp.dest('./src/assets/js/'));
});

//Сжатие изображений 
gulp.task('images', () =>
    gulp.src('./src/assets/images/*')
        //.pipe(imagemin())
        .pipe(gulp.dest('./build/assets/images'))
);

//Очистка папки с проектом 
gulp.task('clean', function () {
    return gulp.src('./build/*', {read: false})
        .pipe(clean());
});

gulp.task('clean-css', function () {
    return gulp.src('./src/assets/css*', {read: false})
        .pipe(clean());
});
gulp.task('clean-cssrtl', function () {
    return gulp.src('./src/assets/css/rtl.css', {read: false})
        .pipe(clean());
});

//Запуск сервера 
gulp.task('webserver', function() {
  gulp.src('./src')
    .pipe(server({
      livereload: true,
      defaultFile: 'index.html',
      directoryListing: false,
      open: true
    }));
});


//Слежение
gulp.task('watch', ['mincss', 'scripts'], function() {
    gulp.watch('./src/assets/sass/**/*.sass', ['mincss']);    
    gulp.watch('./src/assets/sassrtl/*.sass', ['sassrtl']);
    gulp.watch('./src/*.html', browsersync.reload);
    gulp.watch(['./src/assets/js/*.js'], ['scripts']);
    gulp.run('webserver');
});

gulp.task('build', ['clean', 'autoprefix', 'sassrtl', 'images'], function() {
    var buildCss = gulp.src('./src/assets/css/bundle.min.css')
        .pipe(gulp.dest('./build/assets/css'));

    var buildFonts = gulp.src('./src/assets/fonts/**/*')
        .pipe(gulp.dest('./build/assets/fonts'));


    var buildJS = gulp.src('./src/assets/js/*.js')
        //.pipe(uglyfly())
        .pipe(gulp.dest('./build/assets/js/'));

    var buildHtml = gulp.src('./src/*.html')
        .pipe(gulp.dest('./build/'));
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
