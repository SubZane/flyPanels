/*! flypanels - v0.9.0 - 2015-03-04
* https://github.com/SubZane/flyPanels
* Copyright (c) 2015 Andreas Norman; Licensed MIT */
(function ($) {
	// Change this to your plugin name.
	var pluginName = 'flyPanels';

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
		var redrawOnResize = true;
		// Need to get the topbar height in order to later set the correct height of .flypanels-content
		var topBarHeight = parseInt($('.flypanels-topbar').css('height'), 10);

		// Default options for the tree menu component
		var treeMenu = {
			init: false,
			expandHandler: 'span.expand'
		};
		// Extend default treemenu options with those supplied by user.
		options.treeMenu = $.extend({}, treeMenu, options.treeMenu);

		// Extend default options with those supplied by user.
		options = $.extend({}, $.fn[pluginName].defaults, options);

		/**
		 * Initialize plugin.
		 */
		function init() {
			setHeight();
			panelWidth = $('.flypanels-left').css('width');
			attachEvents();
			if (options.treeMenu.init) {
				initTreeMenu();
			}
			$( document ).ready(function() {
				console.log('hejsan load');
				$el.removeClass('preload');
			});
			hook('onInit');
		}

		function setHeight() {
			//$('.flypanels-content').css('height', (parseInt(innerHeight, 10) - topBarHeight) + 'px');
			$('.flypanels-left').css('height', innerHeight);
			$('.flypanels-right').css('height', innerHeight);
			$('.flypanels-overlay').css('height', innerHeight);
		}

		function initTreeMenu() {
			if (kitUtils.isAndroid() || kitUtils.isIOS()) {
				$('.flypanels-treemenu').addClass('touch');
			}
			$('.flypanels-treemenu li.haschildren ' + options.treeMenu.expandHandler).click(function (e) {
				$(this).parent().parent().toggleClass('expanded');
				e.preventDefault();
			});
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
			$('.flypanels-content').on('click touchmove touchend touchleave touchcancel', function (e) {
				close();
				e.preventDefault();
			});
			hook('onOpen');
		}

		function onClose() {
			$('.flypanels-content').off('click touchmove touchend touchleave touchcancel');
			hook('onClose');
		}

		function toggleBodyHtmlClass() {
			$('body').toggleClass('flypanels-open');
			$('html').toggleClass('flypanels-open');
		}

		function openRight(panel) {
			$el.addClass('openright');
			setTimeout(function () {
				toggleBodyHtmlClass();
				$('.flypanels-right').find('[data-panel="' + panel +'"]').show();
				onOpenRight();
				onOpen();
			}, 200);
		}

		function closeRight() {
			$el.removeClass('openright');
			setTimeout(function () {
				toggleBodyHtmlClass();
				$('.offcanvas .panelcontent').hide();
				onCloseRight();
				onClose();
			}, 200);
		}

		function openLeft(panel) {
			$el.addClass('openleft');
			setTimeout(function () {
				toggleBodyHtmlClass();
				$('.flypanels-left').find('[data-panel="' + panel +'"]').show();
				onOpenLeft();
				onOpen();
			}, 200);
		}

		function closeLeft() {
			$el.removeClass('openleft');
			setTimeout(function () {
				toggleBodyHtmlClass();
				$('.offcanvas .panelcontent').hide();
				onCloseLeft();
				onClose();
			}, 200);
		}

		function afterWindowResize() {
			innerHeight = window.innerHeight;
			setHeight();
		}


		function attachEvents() {

			// Prevent scroll if content doesn't need scroll.
			$('.panelcontent').on('touchmove',function(e) {
				if ($(this).prop('scrollHeight') <= parseInt(innerHeight, 10)) {
					e.preventDefault();
				}
			});

			// Prevent scrolling of the panel itself. Only the content panel should be allowed to scroll
			$('.offcanvas').on('touchmove',function(e) {
				e.preventDefault();
			}).on('touchmove', '.panelcontent', function(e) {
				e.stopPropagation();
			});

			$('.flypanels-button-left').on('click', function() {
				var panel = $(this).data('panel');
				if ($('.flypanels-container').hasClass('openleft')) {
					closeLeft();
				} else {
					openLeft(panel);
				}
			});

			$('.flypanels-button-right').on('click', function() {
				var panel = $(this).data('panel');
				if ($('.flypanels-container').hasClass('openright')) {
					closeRight();
				} else {
					openRight(panel);
				}
			});

			if (redrawOnResize === true) {
				var resizeTimer;
				$(window).resize(function () {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(afterWindowResize, 100);
				});
			}

			// Listen for orientation changes
			$(window).bind('orientationchange', function (e) {
				setHeight();
			});

			hook('onLoad');
		}

		/**
		 * Get/set a plugin option.
		 * Get usage: $('#el').flyPanels('option', 'key');
		 * Set usage: $('#el').flyPanels('option', 'key', value);
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
		 * Usage: $('#el').flyPanels('destroy');
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
	// $('#el').flyPanels('option', 'key', value);
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
