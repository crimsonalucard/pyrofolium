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
					'deploy/static/javascript/combined.js':['deploy/static/javascript/main.js']
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
						src: ['**', "!node_modules/**", "!mobile/**", "!deploy/**"],
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
	grunt.registerTask('build', [
		'clean:deployment',
		'copy:deployment',
		'concat:deployment',
		'uglify:deployment',
		'cssmin:deployment',
		'processhtml:deployment',
		'clean:removeold'
	]);


}
