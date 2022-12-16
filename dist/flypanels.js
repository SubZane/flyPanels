(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory(root));
	} else if (typeof exports === 'object') {
		module.exports = factory(root);
	} else {
		root.flyPanels = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
	'use strict';

	//
	// Variables
	//

	var flyPanels = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings;
	var overlay = document.querySelector('.flypanels-overlay');
	var el;
	var redrawOnResize = true;

	// Default settings
	var defaults = {
		transitiontime: 500,
		initClass: 'js-flyPanels',
		useKeyboardEvents: true,
		onInit: function () {},
		onOpen: function () {},
		onClose: function () {},
		onPanelTransitionEnd: function () {},
		OnAttachEvents: function () {},
		onDestroy: function () {},
	};

	//
	// Methods
	//

	var onPanelTransitionEnd = function (el) {
		//console.log(el);
	};

	var onOpen = function () {
		overlay.classList.add('fadein');
		document.querySelector('body').classList.add('flypanels-open');
		document.querySelector('html').classList.add('flypanels-open');
		hook('onOpen');
	};

	var onClose = function () {
		overlay.classList.remove('fadein');
		overlay.classList.add('fadeout');
		document.querySelector('body').classList.remove('flypanels-open');
		document.querySelector('html').classList.remove('flypanels-open');
		hook('onClose');
	};

	var closeAll = function () {
		var panels = document.querySelectorAll('.flypanels-panel');
		forEach(panels, function (index) {
			index.classList.remove('visible');
		});

		var contents = document.querySelectorAll('.flypanels-panel .flypanels-content');
		forEach(contents, function (index) {
			index.classList.remove('visible');
		});
		onClose();
	};

	var open = function (panel_id) {
		document.querySelector(panel_id).classList.add('visible');
		document.querySelector(panel_id + ' .flypanels-content').classList.add('visible');
		onOpen();
	};

	var close = function (panel_id) {
		document.querySelector(panel_id).classList.remove('visible');
		document.querySelector(panel_id + ' .flypanels-content').classList.remove('visible');
		onClose();
	};

	var attachEvents = function () {
		overlay.addEventListener('click', function () {
			closeAll();
		});

		overlay.addEventListener('animationend', () => {
			overlay.classList.remove('fadeout');
		});

		document.querySelector('.flypanels-panel').addEventListener('transitionend', (e) => {
			if (e.propertyName === 'visibility') {
				onPanelTransitionEnd(e);
			}
		});

		var buttons = document.querySelectorAll('.flypanels-button');
		forEach(buttons, function (index) {
			index.addEventListener('click', function () {
				var panel = index.getAttribute('data-target');
				var panel_id = '#' + panel;

				if (hasClass(document.querySelector(panel_id), 'visible')) {
					close(panel_id);
				} else {
					open(panel_id);
				}
			});
		});

		hook('OnAttachEvents');
	};

	var bindKeyEventTriggers = function () {
		document.addEventListener('keydown', function (event) {
			// ESC
			if (event.key === 'Escape') {
				closeAll();
			}
		});
	};

	var hasClass = function (element, classname) {
		if (typeof element.classList !== 'undefined' && element.classList.contains(classname)) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Callback hooks.
	 * Usage: In the defaults object specify a callback function:
	 * hookName: function() {}
	 * Then somewhere in the plugin trigger the callback:
	 * hook('hookName');
	 */
	var hook = function (hookName) {
		if (settings[hookName] !== undefined) {
			// Call the user defined function.
			// Scope is set to the jQuery element we are operating on.
			settings[hookName].call(el);
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function (defaults, options) {
		var extended = {};
		forEach(defaults, function (value, prop) {
			extended[prop] = defaults[prop];
		});
		forEach(options, function (value, prop) {
			extended[prop] = options[prop];
		});
		return extended;
	};

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	flyPanels.destroy = function () {
		// If plugin isn't already initialized, stop
		if (!settings) {
			return;
		}

		// Remove init class for conditional CSS
		document.documentElement.classList.remove(settings.initClass);

		// @todo Undo any other init functions...

		// Remove event listeners
		document.removeEventListener('click', eventHandler, false);

		// Reset variables
		settings = null;
		hook('onDestroy');
	};

	/**
	 * Initialize Plugin
	 * @public
	 * @param {Object} options User settings
	 */
	flyPanels.init = function (options) {
		// feature test
		if (!supports) {
			return;
		}

		// Destroy any existing initializations
		flyPanels.destroy();

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		el = document.querySelector(settings.container);

		if (settings.useKeyboardEvents === true) {
			bindKeyEventTriggers();
		}
		attachEvents();

		// Remove preload class when page has loaded to allow transitions/animations
		//el.classList.remove("preload");
		hook('onInit');
	};

	flyPanels.closePanels = function () {
		close();
	};
	//
	// Public APIs
	//

	return flyPanels;
});
