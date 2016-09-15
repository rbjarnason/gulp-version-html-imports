var gutil = require('gulp-util'),
	appRoot = require('app-root-path'),
	Buffer = require('buffer').Buffer,
	PluginError = gutil.PluginError,
	map = require('event-stream').map,

	defaults = {
		versionRegex: function (extensions) {
			var regexString = '.html"';
			return new RegExp(regexString, 'ig');
		}
	},
	/**
	 * @class ShortId
	 * @classdesc Short unique id generator
	 * @constructor
	 */
	ShortId = function () {
		var lastTime,
			_self = this;
		/**
		 * Get new pseudo-unique id
		 * @alias next
		 * @returns {string} Unique ID
		 */
		_self.next = function () {
			var d = new Date(),
				date = (d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) * 1000;
			while (lastTime >= date) {
				date++;
			}
			lastTime = date;
			return date.toString(16);
		}
	},
	versionHtmlImportsPlugin = function (extensions, options) {
		return map(function (file, cb) {
			var pJson, version, shortId;
			if (!file) {
				throw new PluginError('gulp-rev-append', 'Missing file option for gulp-version-append.');
			}
			if (!file.contents) {
				console.warn("No file contents for "+file);
				cb(null, file);
			}

		    pJson = appRoot.require('package.json');
			version = pJson && pJson.version;
			file.contents = new Buffer(file.contents.toString().replace(defaults.versionRegex(extensions), '.html?v=' + version + '"'));
			cb(null, file);
		});
	};

module.exports = versionHtmlImportsPlugin;
