(function ($) {
	// Change this to your plugin name.
	var pluginName = 'simpleoffcanvasmenu';

	/**
	 * Plugin object constructor.
	 * Implements the Revealing Module Pattern.
	 */
	function Plugin(element, options) {
		// References to DOM and jQuery versions of element.
		var el = element;
		var $el = $(element);
		var innerHeight = window.innerHeight;

		// Extend default options with those supplied by user.
		options = $.extend({}, $.fn[pluginName].defaults, options);

		/**
		 * Initialize plugin.
		 */
		function init() {
			kitUtils.init();
			attachEvents();
			hook('onInit');
		}

		function close() {
			$el.removeClass('openleft');
			$el.removeClass('openright');
		}

		function closeLeft() {
			$el.removeClass('openleft');
		}

		function closeRight() {
			$el.removeClass('openright');
		}

		function onCloseLeft() {
			hook('onCloseLeft');
			$('.socm-left').css('height', '');
		}

		function onCloseRight() {
			hook('onCloseRight');
			$('.socm-right').css('height', '');
		}

		function onOpenLeft() {
			hook('onOpenLeft');
			$('.socm-left').css('height', innerHeight);
		}

		function onOpenRight() {
			hook('onOpenRight');
			$('.socm-right').css('height', innerHeight);
		}

		function toggleBodyHtmlClass() {
			$('body').toggleClass('socm-open');
			$('html').toggleClass('socm-open');
		}

		function attachEvents() {
			$('.socm-content').css('height', innerHeight);

			$('.socm-button-left').on('click', function() {
				$el.toggleClass('openleft');
				toggleBodyHtmlClass();
				if ($(this).hasClass('openleft')) {
					onCloseLeft();
				} else {
					onOpenLeft();
				}
			});

			$('.socm-button-right').on('click', function() {
				$el.toggleClass('openright');
				toggleBodyHtmlClass();
				if ($(this).hasClass('openright')) {
					onCloseRight();
				} else {
					onOpenRight();
				}
			});


			// Listen for orientation changes
			$(window).bind('orientationchange', function (e) {

			});

			$('.socm-content').on('click', function (e) {
				close();
				e.preventDefault();
			});

			$('.socm-content').on('touchmove', function (e) {
				close();
				e.preventDefault();
			});

			$('.socm-content').on('touchend', function (e) {
				close();
				e.preventDefault();
			});

			$('.socm-content').on('touchleave', function (e) {
				close();
				e.preventDefault();
			});

			$('.socm-content').on('touchcancel', function (e) {
				close();
				e.preventDefault();
			});

			/*
			var resizeTimer;
			$(window).resize(function () {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(afterWindowResize, 100);
			});
			*/
			hook('onLoad');
		}

		function treeNavigation() {
			// Toggles the plus/minus icons when opening and closing ul/li in the menu
			$('.mobile-navigation-list li.haschildren a').click(function (e) {
				kitUtils.log(e.target);
				if ($(e.target).is('i')) {
					$(this).parent().toggleClass('expanded');
					if ($(this).parent().hasClass('expanded')) {
						$(e.target).removeClass('fa-plus');
						$(e.target).addClass('fa-minus');
					} else {
						$(e.target).addClass('fa-plus');
						$(e.target).removeClass('fa-minus');
					}
					e.preventDefault();
				}
			});

			$('.mobile-navigation-list li.haschildren a').on('touchstart', function (e) {
				if (!$(e.target).is('i')) {
					$(this).addClass('focus');
				} else {
					$(e.target).addClass('focus');
				}
			});

			$('.mobile-navigation-list li.haschildren a').on('touchmove', function (e) {
				$('.mobile-navigation-list a').removeClass('focus');
				$('.mobile-navigation-list i').removeClass('focus');
			});

			$('.mobile-navigation-list li.haschildren a').on('touchend', function (e) {
				$('.mobile-navigation-list a').removeClass('focus');
				$('.mobile-navigation-list i').removeClass('focus');
			});

			$('.mobile-navigation-list li.haschildren a').on('touchleave', function (e) {
				$('.mobile-navigation-list a').removeClass('focus');
				$('.mobile-navigation-list i').removeClass('focus');
			});

			$('.mobile-navigation-list li.haschildren a').on('touchcancel', function (e) {
				$('.mobile-navigation-list a').removeClass('focus');
				$('.mobile-navigation-list i').removeClass('focus');
			});
		}

		function afterWindowResize() {
			if (kitUtils.isMobileBrowser() === true) {
				innerHeight = window.innerHeight;
			}
		}

		/**
		 * Get/set a plugin option.
		 * Get usage: $('#el').simpleoffcanvasmenu('option', 'key');
		 * Set usage: $('#el').simpleoffcanvasmenu('option', 'key', value);
		 */
		function option(key, val) {
			if (val) {
				options[key] = val;
			} else {
				return options[key];
			}
		}

		/**
		 * Destroy plugin.
		 * Usage: $('#el').simpleoffcanvasmenu('destroy');
		 */
		function destroy() {
			// Iterate over each matching element.
			$el.each(function () {
				var el = this;
				var $el = $(this);

				// Add code to restore the element to its original state...

				hook('onDestroy');
				// Remove Plugin instance from the element.
				$el.removeData('plugin_' + pluginName);
			});
		}

		/**
		 * Callback hooks.
		 * Usage: In the defaults object specify a callback function:
		 * hookName: function() {}
		 * Then somewhere in the plugin trigger the callback:
		 * hook('hookName');
		 */
		function hook(hookName) {
			if (options[hookName] !== undefined) {
				// Call the user defined function.
				// Scope is set to the jQuery element we are operating on.
				options[hookName].call(el);
			}
		}

		// Initialize the plugin instance.
		init();

		// Expose methods of Plugin we wish to be public.
		return {
			option: option,
			destroy: destroy,
		};
	}

	/**
	 * Plugin definition.
	 */
	$.fn[pluginName] = function (options) {
		// If the first parameter is a string, treat this as a call to
		// a public method.
		if (typeof arguments[0] === 'string') {
			var methodName = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			var returnVal;
			this.each(function () {
				// Check that the element has a plugin instance, and that
				// the requested public method exists.
				if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
					// Call the method of the Plugin instance, and Pass it
					// the supplied arguments.
					returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
				} else {
					throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
				}
			});
			if (returnVal !== undefined) {
				// If the method returned a value, return the value.
				return returnVal;
			} else {
				// Otherwise, returning 'this' preserves chainability.
				return this;
			}
			// If the first parameter is an object (options), or was omitted,
			// instantiate a new instance of the plugin.
		} else if (typeof options === 'object' || !options) {
			return this.each(function () {
				// Only allow the plugin to be instantiated once.
				if (!$.data(this, 'plugin_' + pluginName)) {
					// Pass options to Plugin constructor, and store Plugin
					// instance in the elements jQuery data object.
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
		}
	};

	// Default plugin options.
	// Options can be overwritten when initializing plugin, by
	// passing an object literal, or after initialization:
	// $('#el').simpleoffcanvasmenu('option', 'key', value);
	$.fn[pluginName].defaults = {
		onInit: function () {},
		onLoad: function () {},
		onOpenLeft: function () {},
		onOpenRight: function () {},
		onCloseLeft: function () {},
		onCloseRight: function () {},
		onDestroy: function () {}
	};

})(jQuery);
