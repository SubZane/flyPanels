'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: ['dist']
		},
		postcss: {
			options: {
				processors: [
					require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
				]
			},
			dist: {
				src: 'demo/css/flypanels.css'
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: ['src/<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			base: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/<%= pkg.name %>.min.js'
			},
			all: {
				src: ['<%= concat.dist.dest %>', 'src/modules/*.js'],
				dest: 'dist/<%= pkg.name %>.all.min.js'
			},
			modules: {
				expand: true,
				cwd: 'src/modules',
				src: '**/*.js',
				dest: 'dist'
			}
		},
		sass: {
			dist: {                            // Target
				options: {                       // Target options
					sourcemap: 'auto'
				},
				files: {
					'demo/css/flyPanels.css': 'src/sass/flyPanels.scss'
				}
			}
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: true
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: true
				},
				src: 'src/flypanels.js'
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: ['jshint:src']
			},
		},
		copy: {
			default: {
				flatten: true,
				expand: true,
				src: ['dist/*.js'],
				dest: 'demo/js/',
			},
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-postcss');

	// Default task.
	grunt.registerTask('default', ['jshint', 'clean', 'sass', 'concat', 'uglify:base', 'uglify:modules', 'uglify:all','postcss', 'copy']);
};
