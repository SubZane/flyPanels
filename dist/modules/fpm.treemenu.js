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
	var settings;
	var el;
	var JSONObject;
	var HTMLMarkup = '';
	var HTMLMarkupitems = {
		lihaschildren: null,
		linochildren: null,
	};

	// Default settings
	var defaults = {
		expandHandler: 'a.expand',
		onInit: function () {},
		onDestroy: function () {},
		OnExpandOpen: function () {},
		OnExpandClose: function () {},
		OnJSONLoaded: function () {},
		JSONLoadError: function () {},
		UseJSON: false,
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
		if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
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

		document.addEventListener('keydown', function (event) {
			if (hasClass(document.querySelector('body'), 'flypanels-open') && hasClass(document.querySelector('#flypanels-menu'), 'visible')) {
				if (event.key === 'Tab') {
					if (event.shiftKey) {
						if (Array.prototype.indexOf.call(linkElements, event.target) === 0) {
							linkElements[linkElements.length - 1].focus();
							event.preventDefault();
						}
					} else {
						if (Array.prototype.indexOf.call(linkElements, event.target) === -1) {
							linkElements[0].focus();
							event.preventDefault();
						}
					}
				}
			}
		});
	};

	var initKeyboardNavigation = function () {
		window.onkeydown = function (e) {
			var code = e.keyCode ? e.keyCode : e.which;
			if (code === 38) {
				//up key
			} else if (code === 39) {
				//right key
			} else if (code === 40) {
				//down key
			} else if (code === 37) {
				//left key
			}
		};
	};

	var toggleAriaExpanded = function (element) {
		if (element.getAttribute('aria-expanded') === 'false') {
			element.setAttribute('aria-expanded', 'true');
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
		if (active) {
			element.setAttribute('aria-label', element.getAttribute('data-aria-label-active'));
		} else {
			element.setAttribute('aria-label', element.getAttribute('data-aria-label'));
		}
	};

	var parseJSON = function (jsonString) {
		try {
			var o = JSON.parse(jsonString);
			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			// but... JSON.parse(null) returns 'null', and typeof null === "object",
			// so we must check for that, too.
			if (o && typeof o === 'object' && o !== null) {
				return o;
			}
		} catch (e) {}
		console.warn('Error parsing JSON file');
		return false;
	};

	var loadTreeMenu = function (done) {
		var jsonURL = document.querySelector('#flypanels-treemenu').getAttribute('data-json');
		var request = new XMLHttpRequest();
		request.open('GET', jsonURL, true);
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				var response = parseJSON(request.response);
				if (response !== false) {
					if (response.treemenu.length > 0) {
						JSONObject = response.treemenu;
						hook('OnJSONLoaded');
						done();
					} else {
						hook('JSONLoadError');
						console.warn('JSON response empty: ' + response);
					}
				} else {
					hook('JSONLoadError');
					console.warn('JSON response empty: ' + response);
				}
			} else {
				// We reached our target server, but it returned an error
				hook('JSONLoadError');
				console.warn('Request error: ' + request.status);
			}
		};
		request.onerror = function () {
			// There was a connection error of some sort
			hook('JSONLoadError');
			console.warn('error: ' + request);
		};
		request.send();
	};

	var recursiveTreeMenu = function (json) {
		var itemObject;
		if (json.length > 0) {
			HTMLMarkup += '<ul role="group" aria-hidden="true" hidden>';
			json.forEach(function (menuitem) {
				if (menuitem.hasOwnProperty('Children')) {
					var mapObj = {
						'{title}': menuitem.Title,
						'{url}': menuitem.Url,
						'{count}': menuitem.Children.length,
					};
					HTMLMarkup += HTMLMarkupitems.lihaschildren.replace(/{title}|{url}|{count}/gi, function (matched) {
						return mapObj[matched];
					});
					recursiveTreeMenu(menuitem.Children);
					HTMLMarkup += '</li>';
				} else {
					var mapObj = {
						'{title}': menuitem.Title,
						'{url}': menuitem.Url,
					};
					HTMLMarkup += HTMLMarkupitems.linochildren.replace(/{title}|{url}/gi, function (matched) {
						return mapObj[matched];
					});
				}
			});
			HTMLMarkup += '</ul>';
		}
	};

	var prepareTreeMenu = function () {
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
	};

	var loadTemplate = function () {
		var lichildren = document.querySelector('#flypanels-treemenu li.haschildren');
		var linochildren = lichildren.querySelector('li.nochildren').parentNode;
		lichildren.querySelector('ul').remove();
		HTMLMarkupitems.lihaschildren = lichildren.parentNode.innerHTML.replace('</li>', '');
		HTMLMarkupitems.linochildren = linochildren.innerHTML;
		document.querySelector('#flypanels-treemenu').firstChild.remove();
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

		if (settings.UseJSON) {
			loadTemplate();
			loadTreeMenu(function (done) {
				recursiveTreeMenu(JSONObject);
				// Add treemenu markup
				var treemenudiv = document.querySelector('#flypanels-treemenu');
				while (treemenudiv.firstChild) {
					treemenudiv.removeChild(treemenudiv.firstChild);
				}
				var div = document.createElement('div');
				div.innerHTML = HTMLMarkup;
				treemenudiv.appendChild(div.firstChild);
				document.querySelector('#flypanels-treemenu ul').removeAttribute('hidden');
				document.querySelector('#flypanels-treemenu ul').removeAttribute('aria-hidden');
				document.querySelector('#flypanels-treemenu ul').setAttribute('role', 'tree');
				prepareTreeMenu();
				initTabNavigation();
			});
		} else {
			prepareTreeMenu();
			initTabNavigation();
		}

		hook('onInit');
	};

	//
	// Public APIs
	//

	return fpm_treemenu;
});
