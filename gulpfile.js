var gulp = require('gulp');
var sftp = require('gulp-sftp');

var devel_braeco = require('../secret.json');
var casta = require("../casta.json");

gulp.task('upload_static', ['build'], function(cb) {
	gulp.src('./dist/Braeco-client-vue/**/*')
		.pipe(sftp({
			host: devel_braeco.host,
			user: devel_braeco.username,
			pass: devel_braeco.password,
			remotePath: "/home/web/dist/Braeco-client-vue/",
			callback: function() {
				cb(null);
			}
		}));
});

gulp.task('upload_html', ['upload_static'], function() {
	gulp.src('./dist/index.html')
		.pipe(sftp({
			host: casta.host,
			user: casta.username,
			pass: casta.password,
			remotePath: "/home/CastaMo/Braeco-client-vue/dist",
			callback: function() {
				console.log("success");
			}
		}));
});

gulp.task('build', function(cb) {
	var task = require("./build/gulp-build.js");
	task(function() {
		cb(null);
	});
});

gulp.task('default', ['build', 'upload_static', 'upload_html'], function() {

});