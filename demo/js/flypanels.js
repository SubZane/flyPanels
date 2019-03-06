/*! flypanels - v3.1.1 - 2019-03-06
* https://www.andreasnorman.com/flyPanels/
* Copyright (c) 2019 ; Licensed  */
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
	var settings, eventTimeout;
	var el;
	var innerHeight = document.documentElement.clientHeight;
	var panelWidth = document.querySelector('.flypanels-left').clientWidth;
	var scrollbarWidth;
	var redrawOnResize = true;
	// Need to get the topbar height in order to later set the correct height of .flypanels-content
	var topBarHeight = document.querySelector('.flypanels-topbar').clientHeight;

	// Default settings
	var defaults = {
		transitiontime: 500,
		container: '.flypanels-container',
		initClass: 'js-flyPanels',
		useKeyboardEvents: true,
		onInit: function () {},
		onOpen: function () {},
		onClose: function () {},
		onOpenLeft: function () {},
		onCloseLeft: function () {},
		onOpenRight: function () {},
		onCloseRight: function () {},
		afterWindowResize: function () {},
		OnAttachEvents: function () {},
		onWindowResize: function () {},
		onDestroy: function () {}
	};


	//
	// Methods
	//

	var detectScrollbarWidth = function () {
		// Create the measurement node
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'scrollbar-measure';
		document.body.appendChild(scrollDiv);

		// Get the scrollbar width
		scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		//console.warn(scrollbarWidth); // Mac:  15

		// Delete the DIV
		document.body.removeChild(scrollDiv);
	};

	var setHeight = function () {
		document.querySelector('.flypanels-left').style.height = (innerHeight + 'px');
		document.querySelector('.flypanels-right').style.height = (innerHeight + 'px');
		var overlay = document.querySelector('.flypanels-overlay');
		if (overlay) {
			overlay.style.height = innerHeight;
		}
	};

	var hasVerticalScroll = function () {
		var scrollHeight = document.body.scrollHeight;
		var clientHeight = document.documentElement.clientHeight;
		var hasVerticalScrollbar = scrollHeight > clientHeight;
		return hasVerticalScrollbar;
	};

	var isMobileBrowser = function () {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	};

	var close = function () {
		closeLeft();
		closeRight();
		onClose();
	};

	var onCloseLeft = function () {
		document.querySelector('body').classList.remove('flypanels-open');
		document.querySelector('html').classList.remove('flypanels-open');
		document.querySelector('.flypanels-content').style.marginRight = '';
		hook('onCloseLeft');
	};

	var onCloseRight = function () {
		document.querySelector('body').classList.remove('flypanels-open');
		document.querySelector('html').classList.remove('flypanels-open');
		document.querySelector('.flypanels-content').style.marginRight = '';
		hook('onCloseRight');
	};

	var onOpenLeft = function () {
		if (hasVerticalScroll() === true && isMobileBrowser() === false) {
			document.querySelector('.flypanels-content').style.marginRight = scrollbarWidth + 'px';
		}
		document.querySelector('body').classList.add('flypanels-open');
		document.querySelector('html').classList.add('flypanels-open');
		hook('onOpenLeft');
	};

	var onOpenRight = function () {
		if (hasVerticalScroll() === true && isMobileBrowser() === false) {
			document.querySelector('.flypanels-content').style.marginRight = scrollbarWidth + 'px';
		}
		document.querySelector('body').classList.add('flypanels-open');
		document.querySelector('html').classList.add('flypanels-open');
		hook('onOpenRight');
	};

	var onOpen = function () {
		var overlayDiv = document.createElement('div');
		overlayDiv.classList.add('overlay');
		overlayDiv.setAttribute('id', 'flypanels-overlay');
		document.querySelector('.flypanels-content').appendChild(overlayDiv);

		('click touchmove touchend touchleave touchcancel'.split(' ')).forEach(function (event) {
			document.querySelector('#flypanels-overlay').addEventListener(event, function (e) {
				close();
				e.preventDefault();
			});
		});
		hook('onOpen');
	};

	var onClose = function () {
		var overlay = document.querySelector('#flypanels-overlay');
		if (overlay !== null) {
			overlay.classList.add('closing');
			setTimeout(function () {
				if (overlay) {
					overlay.remove();
				}
			}, settings.transitiontime);
		}
		hook('onClose');
	};

	var openRight = function (panel) {
		el.classList.add('openright');
		toggleAriaLabel(document.querySelector('.flypanels-button-right'), true);
		document.querySelector('.flypanels-right').querySelector('[data-panel="' + panel + '"]').style.display = 'block';
		document.querySelector('.flypanels-right').querySelector('[data-panel="' + panel + '"]').setAttribute('aria-hidden', 'false');
		setTimeout(function () {
			document.querySelector('.flypanels-right').querySelector('[data-panel="' + panel + '"]').setAttribute('tabindex', '-1');
		}, settings.transitiontime);
		onOpenRight();
		onOpen();
	};

	var closeRight = function () {
		onClose();
		el.classList.add('closing');
		toggleAriaLabel(document.querySelector('.flypanels-button-right'), false);
		setTimeout(function () {
			el.classList.remove('openright');
			el.classList.remove('closing');
			var panels = document.querySelectorAll('.flypanels-right .panelcontent');
			forEach(panels, function (panel, value) {
				panel.style.display = 'none';
				panel.setAttribute('aria-hidden', 'true');
				panel.removeAttribute('tabindex');
			});
			onCloseRight();
		}, settings.transitiontime);
	};

	var openLeft = function (panel) {
		el.classList.add('openleft');
		toggleAriaLabel(document.querySelector('.flypanels-button-right'), true);
		document.querySelector('.flypanels-left').querySelector('[data-panel="' + panel + '"]').style.display = 'block';
		document.querySelector('.flypanels-left').querySelector('[data-panel="' + panel + '"]').setAttribute('aria-hidden', 'false');
		document.querySelector('.flypanels-left').querySelector('[data-panel="' + panel + '"]').setAttribute('tabindex', '-1');
		document.querySelector('.flypanels-left').querySelector('[data-panel="' + panel + '"]').focus();
		onOpenLeft();
		onOpen();
	};

	var closeLeft = function () {
		onClose();
		el.classList.add('closing');
		toggleAriaLabel(document.querySelector('.flypanels-button-left'), false);
		setTimeout(function () {
			el.classList.remove('closing');
			el.classList.remove('openleft');
			var panels = document.querySelectorAll('.flypanels-left .panelcontent');
			forEach(panels, function (panel, value) {
				panel.style.display = 'none';
				panel.setAttribute('aria-hidden', 'true');
				panel.removeAttribute('tabindex');
			});
			onCloseLeft();
		}, settings.transitiontime);
	};

	var afterWindowResize = function () {
		innerHeight = window.innerHeight;
		setHeight();
		hook('afterWindowResize');
	};

	var attachEvents = function () {
		// Prevent scroll if content doesn't need scroll.
		var panelcontent_panels = document.querySelectorAll('.panelcontent');
		forEach(panelcontent_panels, function (index, value) {
			index.addEventListener('touchmove', function (e) {
				if (index.scrollHeight <= parseInt(innerHeight, 10)) {
					e.preventDefault();
				}
			});
		});

		var buttons_left = document.querySelectorAll('.flypanels-button-left');
		forEach(buttons_left, function (index, value) {
			index.addEventListener('click', function (e) {
				var panel = index.getAttribute('data-panel');
				if (hasClass(document.querySelector('.flypanels-container'), 'openleft')) {
					closeLeft();
				} else {
					if (hasClass(document.querySelector('.flypanels-container'), 'openright')) {
						closeRight();
					} else {
						openLeft(panel);
					}
				}
			});
		});

		var buttons_right = document.querySelectorAll('.flypanels-button-right');
		forEach(buttons_right, function (index, value) {
			index.addEventListener('click', function (e) {
				var panel = index.getAttribute('data-panel');
				if (hasClass(document.querySelector('.flypanels-container'), 'openright')) {
					closeRight();
				} else {
					if (hasClass(document.querySelector('.flypanels-container'), 'openleft')) {
						closeLeft();
					} else {
						openRight(panel);
					}
				}
			});
		});


		if (redrawOnResize === true) {
			window.onresize = onWindowResize;
		}

		// Listen for orientation changes
		window.addEventListener('orientationchange', function () {
			setHeight();
		});
		hook('OnAttachEvents');
	};

	var onWindowResize = function () {
		var resizeTimer;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(afterWindowResize, 100);
		hook('onWindowResize');
	};

	var bindKeyEventTriggers = function () {
		document.addEventListener('keydown', function( event ) {
			// ESC
			if ( event.keyCode === 27 ) {
				closeLeft();
				closeRight();
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
		eventTimeout = null;
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
		detectScrollbarWidth();

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		el = document.querySelector(settings.container);

		setHeight();
		if (settings.useKeyboardEvents === true) {
			bindKeyEventTriggers();
		}
		attachEvents();

		// Remove preload class when page has loaded to allow transitions/animations
		el.classList.remove('preload');
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
