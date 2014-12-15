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
		var panelWidth;
		var fadedOpacity = '0.2';

		// Extend default options with those supplied by user.
		options = $.extend({}, $.fn[pluginName].defaults, options);

		/**
		 * Initialize plugin.
		 */
		function init() {
			kitUtils.init();
			setHeight();
			setupVariables();
			attachEvents();
			hook('onInit');
		}

		function setHeight() {
			$('.socm-content').css('height', innerHeight);
			$('.socm-left').css('height', innerHeight);
			$('.socm-right').css('height', innerHeight);
			$('.socm-overlay').css('height', innerHeight);
		}

		function setupVariables() {
			panelWidth = $('.socm-left').css('width');
		}

		function close() {
			closeLeft();
			closeRight();
			onClose();
		}

		function onCloseLeft() {
			hook('onCloseLeft');
		}

		function onCloseRight() {
			hook('onCloseRight');
		}

		function onOpenLeft() {
			hook('onOpenLeft');
		}

		function onOpenRight() {
			hook('onOpenRight');
		}

		function onOpen() {
			$('.socm-content').on('click touchmove touchend touchleave touchcancel', function (e) {
				close();
				e.preventDefault();
			});
			hook('onOpen');
		}

		function onClose() {
			$('.socm-content').off('click touchmove touchend touchleave touchcancel');
			hook('onClose');
		}

		function toggleBodyHtmlClass() {
			$('body').toggleClass('socm-open');
			$('html').toggleClass('socm-open');
		}

		function openRight(panel) {
			$('.socm-right').transition({
				marginRight: '0px',
				duration: 200,
				easing: 'in',
				complete: function() {
					$el.addClass('openright');
					toggleBodyHtmlClass();
					$(this).find('[data-panel="' + panel +'"]').show();
					onOpenRight();
					onOpen();
				}
			});
			$('.socm-main').transition({
				marginLeft: '-'+panelWidth,
				opacity: fadedOpacity,
				duration: 200,
				easing: 'in'
			});
		}

		function closeRight() {
			$('.socm-right').transition({
				marginRight: '-'+panelWidth,
				duration: 200,
				easing: 'in',
				complete: function() {
					$el.removeClass('openright');
					toggleBodyHtmlClass();
					$('.offcanvas .panelcontent').hide();
					onCloseRight();
					onClose();
				}
			});
			$('.socm-main').transition({
				marginLeft: '0',
				opacity: 1,
				duration: 200,
				easing: 'in'
			});
		}

		function openLeft(panel) {
			$('.socm-left').transition({
				marginLeft: '0px',
				duration: 200,
				easing: 'in',
				complete: function() {
					$el.addClass('openleft');
					toggleBodyHtmlClass();
					$(this).find('[data-panel="' + panel +'"]').show();
					onOpenLeft();
					onOpen();
				}
			});
			$('.socm-main').transition({
				marginRight: '-100%',
				opacity: fadedOpacity,
				duration: 200,
				easing: 'in'
			});
		}

		function closeLeft() {
			$('.socm-left').transition({
				marginLeft: '-'+panelWidth,
				duration: 200,
				easing: 'in',
				complete: function() {
					$el.removeClass('openleft');
					toggleBodyHtmlClass();
					$('.offcanvas .panelcontent').hide();
					onCloseLeft();
					onClose();
				}
			});
			$('.socm-main').transition({
				marginLeft: '0',
				opacity: 1,
				duration: 200,
				easing: 'in'
			});
		}

		function attachEvents() {
			$('.socm-button-left').on('click', function() {
				var panel = $(this).data('panel');
				if ($('.socm-container').hasClass('openleft')) {
					closeLeft();
				} else {
					openLeft(panel);
				}
			});

			$('.socm-button-right').on('click', function() {
				var panel = $(this).data('panel');
				if ($('.socm-container').hasClass('openright')) {
					closeRight();
				} else {
					openRight(panel);
				}
			});

			// Listen for orientation changes
			$(window).bind('orientationchange', function (e) {
				setHeight();
			});

			hook('onLoad');
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
		fadedOpacity: '0.2',
		onInit: function () {},
		onLoad: function () {},
		onOpenLeft: function () {},
		onOpenRight: function () {},
		onCloseLeft: function () {},
		onCloseRight: function () {},
		onDestroy: function () {}
	};

})(jQuery);
