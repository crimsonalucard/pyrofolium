module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify:{
			options:{
				compress: true
			},
			deployment: 	{
						files:	{
									'deploy/static/javascript/combined.min.js': ['deploy/static/javascript/combined.js']
								}
  					}
		},
		concat:{
			deployment:	{
				files:	{
					'deploy/static/css/combined.css':['deploy/static/css/reset.css', 'deploy/static/css/style.css'],
					'deploy/static/javascript/combined.js':['deploy/static/javascript/modernizr.js','deploy/static/javascript/main.js']
				}
			}
		},
		cssmin:{
			deployment: {
				files: {
					'deploy/static/css/combined.min.css':['deploy/static/css/combined.css']
				}
			}
		},
		copy: {
			deployment: {
				files: [
					{
						expand: true,
						cwd: "./",
						src: ['**', "!node_modules/**", "!mobile/**", "!deploy/**", "!.gitignore", "!package.json", "!.ftppass"],
						dest: 'deploy'
					}
				]
			}
		},
		clean: {
			deployment: ["deploy"],
			removeold: ["deploy/**/*.css",
						"!deploy/**/*.min.css",
						"deploy/**/*.js",
						"!deploy/**/*.min.js",
						"deploy/package.json",
						"deploy/.gitignore"]
		},
		processhtml: {
			deployment:{
				files: {
					'deploy/index.html':'deploy/index.html'
				}
			}
		},
		'ftp-deploy': {
			deployment:{
				auth:	{
							host:'pyrofolium.com',
							port: 21,
							authKey: 'key1'
						},
				src:'deploy/',
				dest: 'pyrofolium.com/'
			}
		}


	});

//	grunt.registerTask('deploy', 'Deploy the code.' [
//		'clean','deployment',
//		'copy:deployment',
//		'concat:deployment',
//		'uglify:deployment',
//		'cssmin:deployment',
//		'clean:removeold'
//	]);
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.registerTask('build', [
		'clean:deployment',
		'copy:deployment',
		'concat:deployment',
		'uglify:deployment',
		'cssmin:deployment',
		'processhtml:deployment',
		'clean:removeold'
	]);
	grunt.registerTask('deploy', ['build', 'ftp-deploy']);


}
