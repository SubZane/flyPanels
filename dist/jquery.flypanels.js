/*! flypanels - v0.12.1 - 2015-06-17
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
			expandHandler: 'a.expand'
		};
		// Extend default treemenu options with those supplied by user.
		options.treeMenu = $.extend({}, treeMenu, options.treeMenu);

		// Default options for the search component
		var search = {
			init: false,
			saveQueryCookie: false,
			searchPanel: $('.offcanvas').find('[data-panel="search"]')
		};
		// Extend default search options with those supplied by user.
		options.search = $.extend({}, search, options.search);


		// Extend default options with those supplied by user.
		options = $.extend({}, $.fn[pluginName].defaults, options);

		/**
		 * Initialize plugin.
		 */
		function init() {
			setHeight();
			panelWidth = $('.flypanels-left').css('width');
			attachEvents();
			if (options.search.init) {
				initSearch();
			}
			if (options.treeMenu.init) {
				initTreeMenu();
			}

			// Remove preload class when page has loaded to allow transitions/animations
			$(document).ready(function () {
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
			$('body').removeClass('flypanels-open');
			$('html').removeClass('flypanels-open');
			hook('onCloseLeft');
		}

		function onCloseRight() {
			$('body').removeClass('flypanels-open');
			$('html').removeClass('flypanels-open');
			hook('onCloseRight');
		}

		function onOpenLeft() {
			$('body').addClass('flypanels-open');
			$('html').addClass('flypanels-open');
			hook('onOpenLeft');
		}

		function onOpenRight() {
			$('body').addClass('flypanels-open');
			$('html').addClass('flypanels-open');
			hook('onOpenRight');
		}

		function onOpen() {
			$('.flypanels-content').append('<div id="flypanels-overlay" class="overlay"></div>');
			$('.flypanels-content').on('click touchmove touchend touchleave touchcancel', function (e) {
				close();
				e.preventDefault();
			});
			hook('onOpen');
		}

		function onClose() {
			$('.flypanels-content #flypanels-overlay').remove();
			$('.flypanels-content').off('click touchmove touchend touchleave touchcancel');
			hook('onClose');
		}

		function openRight(panel) {
			$el.addClass('openright');
			setTimeout(function () {
				$('.flypanels-right').find('[data-panel="' + panel + '"]').show();
				onOpenRight();
				onOpen();
			}, 200);
		}

		function closeRight() {
			$el.removeClass('openright');
			setTimeout(function () {
				$('.offcanvas .panelcontent').hide();
				onCloseRight();
				onClose();
			}, 200);
		}

		function openLeft(panel) {
			$el.addClass('openleft');
			setTimeout(function () {
				$('.flypanels-left').find('[data-panel="' + panel + '"]').show();
				onOpenLeft();
				onOpen();
			}, 200);
		}

		function closeLeft() {
			$el.removeClass('openleft');
			setTimeout(function () {
				$('.offcanvas .panelcontent').hide();
				onCloseLeft();
				onClose();
			}, 200);
		}

		function afterWindowResize() {
			innerHeight = window.innerHeight;
			setHeight();
		}

		function initSearch() {
			if (kitUtils.isAndroid() || kitUtils.isIOS()) {
				$('.flypanels-searchresult').addClass('touch');
			}
			options.search.searchPanel.find('.searchbutton').on('click', function (event) {
				event.preventDefault();
				searchProgress('show');
				doSearch(options.search.searchPanel.find('.searchbox input').val());
			});

			options.search.searchPanel.find('.searchbox input').keydown(function (event) {
				if (event.which === 13) {
					searchProgress('show');
					doSearch($(this).val());
					$(this).blur();
				}
			});

			if (cookies.has('searchQuery') === true && options.search.saveQueryCookie ===  true) {
				doSearch(cookies.get('searchQuery'));
			}
		}

		function searchError(state) {
			if (state === 'hide') {
				options.search.searchPanel.find('.errormsg').hide();
			} else {
				options.search.searchPanel.find('.errormsg').show();
			}
		}

		function searchProgress(state) {
			if (state === 'hide') {
				options.search.searchPanel.find('.loading').hide();
			} else {
				options.search.searchPanel.find('.loading').show();
			}
		}

		var cookies = {
			get: function (sKey) {
				if (!sKey) {
					return null;
				}
				return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
			},
			set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
				if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
					return false;
				}
				var sExpires = '';
				if (vEnd) {
					switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
						break;
					case String:
						sExpires = '; expires=' + vEnd;
						break;
					case Date:
						sExpires = '; expires=' + vEnd.toUTCString();
						break;
					}
				}
				document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
				return true;
			},
			remove: function (sKey, sPath, sDomain) {
				if (!this.hasItem(sKey)) {
					return false;
				}
				document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
				return true;
			},
			has: function (sKey) {
				if (!sKey) {
					return false;
				}
				return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
			},
			keys: function () {
				var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
				for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
					aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
				}
				return aKeys;
			}
		};

		function doSearch(query) {
			searchError('hide');

			$jsonurl = options.search.searchPanel.find('.searchbox').data('searchurl');
			$ajaxCall = $.ajax({
				url: $jsonurl + '&q=' + query,
				dataType: 'json'
			});

			// Ajax success
			$ajaxCall.done(function (response) {
				var output;
				$foundResults = response.Items.length;

				// Check if any products found
				if ($foundResults > 0) {
					if (options.search.saveQueryCookie ===  true) {
						cookies.set('searchQuery', query, null, '/');
					}
					output = buildResultsList(response.Items);
				} else {
					//$.removeCookie('searchQuery');
					if (options.search.saveQueryCookie ===  true) {
						cookies.remove('searchQuery', '/');
					}
					searchError('show');
				}

				// Render html
				options.search.searchPanel.find('.resultinfo .query').html(query);
				options.search.searchPanel.find('.resultinfo .num').html($foundResults);
				options.search.searchPanel.find('.flypanels-searchresult').html(output);
				searchProgress('hide');
				options.search.searchPanel.find('.resultinfo').show();
				options.search.searchPanel.find('.flypanels-searchresult').show();
			});

			// Ajax error
			$ajaxCall.fail(function () {
				// Render error message ***** Should we get the error message from response.error? *****
				// If so, include jqXHR and response in the fail function
				searchError('show');
			});
		}

		function buildResultsList(results) {
			output = '<ul>';
			for (var i in results) {
				if (results[i].Type === 'Page') {
					output += '<li><a href="' + results[i].LinkUrl + '"><span class="link">' + results[i].Header + '</span>  <span class="type"><i class="fa page"></i></span></a>';
				} else {
					output += '<li><a href="' + results[i].LinkUrl + '"><span class="link">' + results[i].Header + '</span>  <span class="type"><i class="fa doc"></i></span></a>';
				}
			}
			output += '</ul>';
			return output;
		}


		function attachEvents() {

			// Prevent scroll if content doesn't need scroll.
			$('.panelcontent').on('touchmove', function (e) {
				if ($(this).prop('scrollHeight') <= parseInt(innerHeight, 10)) {
					e.preventDefault();
				}
			});

			// Prevent scrolling of the panel itself. Only the content panel should be allowed to scroll
			$('.offcanvas').on('touchmove', function (e) {
				e.preventDefault();
			}).on('touchmove', '.panelcontent', function (e) {
				e.stopPropagation();
			});

			$('.flypanels-button-left').on('click', function () {
				var panel = $(this).data('panel');
				if ($('.flypanels-container').hasClass('openleft')) {
					closeLeft();
				} else {
					openLeft(panel);
				}
			});

			$('.flypanels-button-right').on('click', function () {
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
