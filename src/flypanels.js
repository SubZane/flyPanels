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

	var innerHeight = window.innerHeight;
	var panelWidth;
	var redrawOnResize = true;
	// Need to get the topbar height in order to later set the correct height of .flypanels-content
	var topBarHeight = document.querySelector('.flypanels-topbar').clientHeight;

	var treeMenu = {
		init: false,
		expandHandler: 'a.expand'
	};

  var search = {
    init: false,
    saveQueryCookie: false,
    searchPanel: document.querySelector('.offcanvas').querySelector('[data-panel="search"]')
  };


	// Default settings
	var defaults = {
		container: '.flypanels-container',
		initClass: 'js-flyPanels',
		callbackBefore: function () {},
		callbackAfter: function () {}
	};


	//
	// Methods
	//

	var setHeight = function () {
		document.querySelector('.flypanels-left').style.height = (innerHeight + 'px');
		document.querySelector('.flypanels-right').style.height = (innerHeight + 'px');
		var overlay = document.querySelector('.flypanels-overlay');
		if (overlay) {
			overlay.style.height = innerHeight;
		}

	};

	var initTreeMenu = function () {
		if (isAndroid() || isIOS()) {
			document.querySelector('.flypanels-treemenu').classList.add('touch');
		}

    var expanders = document.querySelectorAll('.flypanels-treemenu li.haschildren ' + settings.treeMenu.expandHandler);
    forEach(expanders, function (expandLink, value) {
      expandLink.addEventListener('click', function (e) {
        this.parentElement.parentElement.classList.toggle('expanded');
        e.preventDefault();
      });
    });
  };

	var close = function () {
		closeLeft();
		closeRight();
		onClose();
	};

	var onCloseLeft = function () {
    document.querySelector('body').classList.remove('flypanels-open');
		document.querySelector('html').classList.remove('flypanels-open');
		hook('onCloseLeft');
	};

	var onCloseRight = function () {
    document.querySelector('body').classList.remove('flypanels-open');
		document.querySelector('html').classList.remove('flypanels-open');
		hook('onCloseRight');
	};

	var onOpenLeft = function () {
    document.querySelector('body').classList.add('flypanels-open');
		document.querySelector('html').classList.add('flypanels-open');
		hook('onOpenLeft');
	};

	var onOpenRight = function () {
    document.querySelector('body').classList.add('flypanels-open');
		document.querySelector('html').classList.add('flypanels-open');
		hook('onOpenRight');
	};


	var onOpen = function () {
		document.querySelector('.flypanels-content').innerHTML += '<div id="flypanels-overlay" class="overlay"></div>';
		document.querySelector('.flypanels-content').addEventListener('click touchmove touchend touchleave touchcancel', function (e) {
			close();
			e.preventDefault();
		});
		hook('onOpen');
	};

	var onClose = function () {
		document.querySelector('.flypanels-content #flypanels-overlay').remove();
		document.querySelector('.flypanels-content').removeEventListener('click touchmove touchend touchleave touchcancel');
		hook('onClose');
	};

	var openRight = function (panel) {
		el.classList.add('openright');
		setTimeout(function () {
			document.querySelector('.flypanels-right').querySelector('[data-panel="' + panel + '"]').style.display = 'block';
			onOpenRight();
			onOpen();
		}, 200);
	};

	var closeRight = function () {
		el.classList.remove('openright');
		setTimeout(function () {
      var panels = document.querySelectorAll('.flypanels-right .panelcontent');
      forEach(panels, function (panel, value) {
        panel.style.display = 'none';
      });
			onCloseRight();
			onClose();
		}, 200);
	};

	var openLeft = function (panel) {
		el.classList.add('openleft');
		setTimeout(function () {
			document.querySelector('.flypanels-left').querySelector('[data-panel="' + panel + '"]').style.display = 'block';
			onOpenLeft();
			onOpen();
		}, 200);
	};

	var closeLeft = function () {
		el.classList.remove('openleft');
		setTimeout(function () {
      var panels = document.querySelectorAll('.flypanels-left .panelcontent');
      forEach(panels, function (panel, value) {
        panel.style.display = 'none';
      });
			onCloseLeft();
			onClose();
		}, 200);
	};

	var afterWindowResize = function () {
		innerHeight = window.innerHeight;
		setHeight();
	};

	var attachEvents = function () {

		// Prevent scroll if content doesn't need scroll.
    var panelcontent = document.querySelectorAll('.panelcontent', 'touchmove');
    forEach(panelcontent, function (index, value) {
      index.addEventListener('touchmove', function (e) {
        if (panel.scrollHeight <= parseInt(innerHeight, 10)) {
          e.preventDefault();
        }
      });
    });

    // Prevent scrolling of the panel itself. Only the content panel should be allowed to scroll
    var offcanvas = document.querySelectorAll('.panelcontent', 'touchmove');
    forEach(offcanvas, function (index, value) {
      index.addEventListener('touchmove', function (e) {
        e.preventDefault();
      });
    });

    var offcanvaspanelcontent = document.querySelectorAll('.offcanvas .panelcontent', 'touchmove');
    forEach(offcanvaspanelcontent, function (index, value) {
      index.addEventListener('touchmove', function (e) {
        e.preventDefault();
      });
    });

		document.querySelector('.flypanels-button-left').addEventListener('click', function () {
			var panel = this.getAttribute('data-panel');
			if (hasClass(document.querySelector('.flypanels-container'), 'openleft')) {
				closeLeft();
			} else {
				openLeft(panel);
			}
		});

		document.querySelector('.flypanels-button-right').addEventListener('click', function () {
			var panel = this.getAttribute('data-panel');
			if (hasClass(document.querySelectorAll('.flypanels-container'), 'openright')) {
				closeRight();
			} else {
				openRight(panel);
			}
		});

		var hasClass = function (element, classname) {
			if (element.classList.contains(classname)) {
				return true;
			} else {
				return false;
			}
		};


		if (redrawOnResize === true) {
      window.onresize = onWindowResize;
		}

		// Listen for orientation changes
    window.addEventListener('orientationchange', function() {
      setHeight();
    });
		hook('onLoad');
	};

  var onWindowResize = function () {
    var resizeTimer;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(afterWindowResize, 100);
  };


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

	var addEventListenerList = function (list, event, fn) {
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].addEventListener(event, fn, false);
		}
	};

	var addEventListenerByClass = function (className, event, fn) {
		var list = document.getElementsByClassName(className);
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].addEventListener(event, fn, false);
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

    options.treeMenu = extend(treeMenu, options.treeMenu || {});
    options.search = extend(search, options.search || {});

		// Merge user options with defaults
		settings = extend(defaults, options || {});

		el = document.querySelector(settings.container);

		setHeight();
		panelWidth = document.querySelectorAll('.flypanels-left').width;
		attachEvents();

    if (settings.search.init) {
      //initSearch();
    }
    if (settings.treeMenu.init) {

      initTreeMenu();
    }

		// Remove preload class when page has loaded to allow transitions/animations
		el.classList.remove('preload');
		hook('onInit');
	};


	//
	// Public APIs
	//

	return flyPanels;

});
