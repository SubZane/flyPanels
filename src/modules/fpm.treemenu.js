(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory(root));
	} else if (typeof exports === 'object') {
		module.exports = factory(root);
	} else {
		root.fpm_treemenu = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var fpm_treemenu = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, eventTimeout;
	var el;

	// Default settings
	var defaults = {
		expandHandler: 'a.expand',
		onInit: function () {},
		onDestroy: function () {},
		OnExpandOpen: function () {},
		OnExpandClose: function () {}
	};


	//
	// Methods
	//

	var isAndroid = function () {
		if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
			return true;
		} else {
			return false;
		}
	};

	var isIOS = function () {
		if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/iPod/i))) {
			return true;
		} else {
			return false;
		}
	};

	var hasClass = function (element, classname) {
		if (typeof element.classList !== 'undefined' && element.classList.contains(classname)) {
			return true;
		} else {
			return false;
		}
	};

	var initTabNavigation = function () {
		var linkElements = document.querySelectorAll('.flypanels-treemenu a, .flypanels-button-left');

		window.onkeydown = function( event ) {
			if (hasClass(document.querySelector('body'), 'flypanels-open') && hasClass(document.querySelector('.flypanels-container'), 'openleft')){
				// 9 = Tab
				if ( event.keyCode === 9 ) {
					if (event.shiftKey) {
						if (Array.prototype.indexOf.call(linkElements, event.target) === 0) {
							linkElements[linkElements.length-1].focus();
							event.preventDefault();
						}
					}	else {
						if (Array.prototype.indexOf.call(linkElements, event.target) === -1) {
							linkElements[0].focus();
							event.preventDefault();
						}
					}
				}
			}
		};
	};

	var initKeyboardNavigation = function () {
		window.onkeydown = function (e) {
			var code = e.keyCode ? e.keyCode : e.which;
			if (code === 38) { //up key

			} else if (code === 39) { //right key

			} else if (code === 40) { //down key

			} else if (code === 37) { //left key

			}
		};
	};

	var toggleAriaExpanded = function (element) {
		if (element.getAttribute('aria-expanded') === 'false') {
			element.setAttribute('aria-expanded', 'true')
			toggleAriaLabel(element.querySelector('a.expand'), true);
			element.querySelector('ul').setAttribute('aria-hidden', 'false');
			element.querySelector('ul').removeAttribute('hidden');
			setTimeout(function () {
				element.classList.toggle('expanded');
			}, settings.transitiontime);

			hook('OnExpandOpen');
		} else {
			element.setAttribute('aria-expanded', 'false');
			toggleAriaLabel(element.querySelector('a.expand'), false);
			element.querySelector('ul').setAttribute('aria-hidden', 'true');
			element.querySelector('ul').setAttribute('hidden', '');

			//Since we removed a hidden attribute we need to wait, if we want the animation to run visible. Very silly.
			setTimeout(function () {
				element.classList.toggle('expanded');
			}, settings.transitiontime);

			hook('OnExpandClose');
		}
	};


	var toggleAriaLabel = function (element, active) {
		if(active){
			element.setAttribute('aria-label', element.getAttribute('data-aria-label-active'));
		}
		else {
			element.setAttribute('aria-label', element.getAttribute('data-aria-label'));
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
	fpm_treemenu.destroy = function () {

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
		eventTimeout = null;
		hook('onDestroy');
	};

	/**
	 * Initialize Plugin
	 * @public
	 * @param {Object} options User settings
	 */
	fpm_treemenu.init = function (options) {
		// feature test
		if (!supports) {
			return;
		}

		// Destroy any existing initializations
		fpm_treemenu.destroy();

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		el = document.querySelector(settings.container);

		if (isAndroid() || isIOS()) {
			document.querySelector('.flypanels-treemenu').classList.add('touch');
		}

		var expanders = document.querySelectorAll('.flypanels-treemenu li.haschildren ' + settings.expandHandler);
		forEach(expanders, function (expandLink, value) {
			expandLink.addEventListener('click', function (e) {
				toggleAriaExpanded(this.parentElement.parentElement);
				e.preventDefault();
			});
		});
		initTabNavigation();
		hook('onInit');
	};

	//
	// Public APIs
	//

	return fpm_treemenu;
});
