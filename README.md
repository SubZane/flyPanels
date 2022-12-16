# flyPanels v4.0.2

flyPanels - responsive off canvas menu panels

<p>
	<img src="https://img.shields.io/github/v/release/SubZane/flyPanels?sort=semver">
	<img src="https://img.shields.io/static/v1?label=license&message=MIT&color=brightgreen">
</p>

## Features

FlyPanels is a responsive off canvas menu plugin for websites or web apps. It supports all modern browsers from IE11. This new version is written in vanilla JavaScript and has no other dependencies. The old jQuery version can still be accessed on a [separate branch called jQuery](https://github.com/SubZane/flyPanels/tree/jQuery). Take note that the old jQuery version will not receive as much attention from me as I'm moving away from jQuery.

Compared to many other off canvas menu plugins out there this one is more solid and behaves more like a native solution. Try it!

### [View demo](http://www.andreasnorman.com/flypanels)

## Browser Support

- Google Chrome
- Firefox 40+
- Safari 14+
- Mobile Safari iOS 12+

## Installation

```
yarn add flyPanels
```

### Setup

```html
<!-- You'll need to include flyPanels of course! -->
<script src="flyPanels.js"></script>

<!-- Some basic CSS is required of course -->
<link rel="stylesheet" href="css/flyPanels.css" />
```

## Usage

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
	flyPanels.init();
});
```

### Settings and Defaults

```javascript
options: {
  treeMenu: {
    init: false,
    expandHandler: 'span.expand',
    UseJSON: false,
    OnExpandOpen: function () {},
    OnExpandClose: function () {},
    OnJSONLoaded: function () {},
    JSONLoadError: function () {}
  },
  search = {
    init: false,
    saveQueryCookie: false
  },
  onInit: function () {},
  onInitTreeMenu: function () {},
  onOpen: function () {},
  onClose: function () {},
  onCloseAll: function () {},
  afterWindowResize: function () {},
  OnAttachEvents: function () {},
  onWindowResize: function () {},
  onEmptySearchResult: function () {},
  onSearchError: function () {},
  onSearchSuccess: function () {},
  onInitSearch: function () {},
  onDestroy: function () {}
};
```

- `treeMenu`:
  - `init`: Boolean - If it should look for and init the expanding treemenu.
  - `expandHandler`: String - The element that should have the click event to open/close submenu (expand/contract)
  - `UseJSON`: Boolean - The treemenu can generate HTML markup from a JSON file if specified.
  - `OnExpandOpen`: What to do just after a node has expanded/opened.
  - `OnExpandClose`: What to do just after a node has closed.
  - `OnJSONLoaded`: What to do just after the JSON has been loaded.
  - `JSONLoadError`: What to do if an error occurred during the loading of the JSON.
- `search`:
  - `init`: Boolean - If it should look for and init the search component.
  - `saveQueryCookie`: Boolean - If the search query should be stored in a session cookie to remember the last search.
- `onInit`: What to do after the plugin is initialized.
- `onLoad`: What to do after the plugin has loaded.
- `onOpen`: What to do after a panel has opened.
- `onClose`: What to do after a panel has closed.
- `onCloseAll`: What to do after all panels has closed.
- `afterWindowResize`: What to do just after a window resize.
- `OnAttachEvents`: What to do just after events has been attached.
- `onWindowResize`: What to do just on window resize.
- `onEmptySearchResult`: What to do if search result is empty.
- `onSearchError`: What to do just if search returns an error.
- `onSearchSuccess`: What to do if search is successful.
- `onInitSearch`: What to do just after search is initialized.
- `onInitTreeMenu`: What to do just after tree menu is initialized.
- `onDestroy`: What to do just after plugin is destroyed.

### Typical setup

This could be your typical script setup.

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
	flyPanels.init();
});
```

### Html needed for a basic setup

```html
<div class="flypanels-overlay"></div>
<div id="flypanels-menubutton" class="flypanels-button menu" data-target="flypanels-menu"></div>
<div id="flypanels-menu" class="flypanels-panel door-left">
	<div class="flypanels-content door-left">
		<div class="flypanels-inner">
			<p>panel content goes here</p>
		</div>
	</div>
</div>
```

### Using the expanding treemenu component

If you want to use the treemenu component you'll need to set it to true in the options and you'll need to add the necessary HTML markup.

To customize the appearance of the treemenu you can either modify the LESS files and rebuild or just simply override the default styles.

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
	flyPanels.init({
		onInit: function () {
			fpm_treemenu.init();
		},
	});
});
```

```html
<div class="flypanels-overlay"></div>
<div id="flypanels-menubutton" class="flypanels-button menu" data-target="flypanels-menu"></div>
<div id="flypanels-menu" class="flypanels-panel door-left">
	<div class="flypanels-content door-left">
		<div class="flypanels-inner">
			<nav class="flypanels-treemenu" role="navigation" aria-label="Main navigation" id="flypanels-treemenu">
				<ul>
					<li class="haschildren">
						<a href="#"
							><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span
						></a>
						<ul>
							<li class="haschildren">
								<a href="#"
									><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span
								></a>
								<ul>
									<li class="haschildren">
										<a href="#"
											><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span
										></a>
										<ul>
											<li class="haschildren">
												<a href="#"
													><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span
												></a>
												<ul>
													<li>
														<a href="#"><span class="link">Example menu item</span></a>
													</li>
													<li>
														<a href="#"><span class="link">Example menu item</span></a>
													</li>
												</ul>
											</li>
											<li>
												<a href="#"><span class="link">Example menu item</span></a>
											</li>
										</ul>
									</li>
									<li>
										<a href="#"><span class="link">Example menu item</span></a>
									</li>
								</ul>
							</li>
							<li>
								<a href="#"><span class="link">Example menu item</span></a>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	</div>
</div>
```

### Using the expanding treemenu component with JSON

If you want to use the treemenu component with JSON as data srouce you'll need to set it to true in the options and you'll need to add the necessary HTML markup. You will also need to specify the URL to the JSON file in the data attribute `data-json`.

To customize the appearance of the treemenu you can either modify the LESS files and rebuild or just simply override the default styles.

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
	flyPanels.init({
		onInit: function () {
			fpm_treemenu.init({
				UseJSON: true,
			});
		},
	});
});
```

```html
<div class="flypanels-overlay"></div>
<div id="flypanels-menubutton" class="flypanels-button menu" data-target="flypanels-menu"></div>
<div id="flypanels-menu" class="flypanels-panel door-left">
	<div class="flypanels-content door-left">
		<div class="flypanels-inner">
			<nav class="flypanels-treemenu" role="navigation" aria-label="Main navigation" data-json="json/treemenu.json" id="flypanels-treemenu">
				<!-- Tree Menu will render here. Please keep template below -->
				<ul>
					<li class="haschildren" role="treeitem" aria-expanded="false">
						<div>
							<a href="{url}" class="link">{title}</a
							><a aria-label="Expand submenu" href="#" data-aria-label="Expand submenu" data-aria-label-active="Collapse submenu" class="expand"
								>{count}<i class="fa icon" aria-hidden="true"></i
							></a>
						</div>
						<ul>
							<li class="nochildren">
								<div><a href="{url}" class="link">{title}</a></div>
							</li>
						</ul>
					</li>
				</ul>
				<!-- End: Tree Menu will render here.  Please keep template below -->
			</nav>
		</div>
	</div>
</div>
```

### Using the search component

If you want to use the search component you'll need to set it to true in the options and you'll need to add the necessary HTML markup.

To customize the appearance of the search panel and its result you can either modify the LESS files and rebuild or just simply override the default styles.

```javascript
document.addEventListener('DOMContentLoaded', function (event) {
	flyPanels.init({
		onInit: function () {
			fpm_search.init({ saveQueryCookie: true });
		},
	});
});
```

```html
<div class="flypanels-overlay"></div>
<div id="flypanels-searchbutton" class="flypanels-button search" data-target="flypanels-search"></div>
<div id="flypanels-search" class="flypanels-panel door-right">
	<div class="flypanels-content door-right">
		<div class="flypanels-inner">
			<div class="searchpanel">
				<div class="searchbox" data-searchurl="json/searchresult.json?search=true">
					<input title="search" type="text" id="flypanels-searchfield" />
					<a href="#" aria-label="search" class="searchbutton"></a>
				</div>
				<div class="resultinfo" aria-live="polite" aria-hidden="true" hidden>
					You search for "<span class="query">lorem ipsum</span>" resulted in <span class="num">5</span> hits.
				</div>
				<div class="errormsg" aria-live="polite" aria-hidden="true" hidden>Something went wrong, please refresh the page and try again.</div>

				<div class="loading" aria-hidden="true" hidden>
					<div class="loader"></div>
					<span>Searching...</span>
				</div>
				<div class="flypanels-searchresult" aria-hidden="true" aria-live="polite" hidden></div>
			</div>
		</div>
	</div>
</div>
```

## changelog

### 4.0.2

- Fixed issue with onWindowResize

#### 4.0.1

- Minor fixes and cleanup of code

#### 4.0.0

- New: Re-written HTML markup. The component no longer wraps around your content, making it easier to implement and less cumbersome.
- New: Added some neat animations to the panels. Currently there's only two animations but I will add some more soon enough.
- New: The buttons to open the panels are now separated and can be placed anywhere you like.
- Note: The treemenu and search components still works exactly the same.

#### 3.2.0

- New: Added support for generating a treemenu from a JSON file.

#### 3.1.1

- FIX: Repository bug

#### 3.1.0

- Moved from Bower to Yarn

#### 3.0.0

- New modular approach. Both the search and treemenu are now separate scripts that need to be incluced if needed.
- Sizing adjusted from pixel sizing to viewport sizing for a more responsive approach. Markup and CSS Changed.
- The panel widths are now possible to adjust depending on screen size using media queries. Default it uses the breakpoints defined by Bootstrap.
- Added keyboard navigation TAB for better WCAG support.
- ESC key now closes the currently open panel.

#### 2.0.6

- Fix: Adjustments to animations en environment.
- Fix: Prevents content to "jump" due to scrollbar in desktop mode.

#### 2.0.5

- Fix: Bug with the search not removing previous search query and number of hits.

#### 2.0.4

- Fix: Bug with the search not removing previous search results if new query results in zero hits.

#### 2.0.3

- Fix: Bug with the search not handling zero results properly and not hiding the spinner after a search.

#### 2.0.2

- Fix: A case where flyPanels made RoyalSlider to not work after a panel has been opened. It seems that using 'innerHTML' to add elements to the DOM made RoyalSlider to stop working. Rewrote my function to not use innerHTML. Now it works just fine. Who would have known, eh?

#### 2.0.1

- Fix: The CSS contained some too new rules that prevented it from working at all in iOS8. Added CSS prefixes to fix it.
- Change: Added autoprefixer to the build.

#### 2.0.0

- BIG CHANGE: Rewrote the plugin in vanilla JavaScript. jQuery is no longer required. Last version to use jQuery is 0.14.0
- Change: Smoother CSS transitions and changed animation structure for faster Paint and Layout
- Change: Removed legacy support for LESS. flyPanels now only supports SCSS

#### 0.14.0

- FIX: Fixed sidepanels scrolling issue with iOS9 that can occur depending on your meta viewport settings

#### 0.13.0

- Added SASS/SCSS support. flyPanels can now build with SASS or LESS.

#### 0.12.1

- Fixed CSS issue with the tree menu. #3

#### 0.12.0

- Added CSS class for active menu item.

#### 0.11.2

- Renamed all LESS variables. Added prefix `flypanels_` to all.

#### 0.11.1

- The search result shouldn't be a `nav` element. Changed to a `div`. LESS file updated as well.

#### 0.11.0

- Updated the HTML markup for the treemenu component for a more accessible menu. Switched out `span` elements for `a` link elements
- Addressed some issues with horizontal scrollbars caused by scrollbars on units with visible scrollbars. Horizontal overflow in the panels is now set to `overflow-x:hidden` and vertical scroll is now set to auto `overflow-y:auto`. This is maybe not the best solution to address scrollbar width.

#### 0.10.4

- Fixed bug with topbar not being fixed because of `translate3d`.

#### 0.10.3

- Bug fix: Errors in the CSS preventing the panels to work in Firefox.

#### 0.10.2

- Small fix: Removing and adding classes when opening and closing panels wasn't working properly resulting in unwanted scroll.

#### 0.10.0

- Added search panel. This is a panel with an search form that calls a URL with a querystring passing along a keyword expecting a JSON response. Use this to produce a search result in the panel. Look at the dummy JSON file to understand on how the JSON format should be.
- Added search settings. Default the search features will not init, just like the tree menu component it must be set to true to init.

#### 0.9.1

- Added a `preload` class to the container wich is removed at page load, to prevent objects from animating to their starting positions.

#### 0.9.0

- Removed support for IE9
- Removed the need for jquery.transit. Making the whole script as such smaller.
- Added CSS3 translate3d animations for better and smoother animations.
- Removed the `fadedOpacity` option (The opacity value of the content when a panel is open). This is now a LESS variable you can change in the LESS file
- Please refer to the LESS files for all visual customizations you need.

#### 0.8.0

- Added a very nice and expanding treemenu component supporting up to 6 levels of depth.

#### 0.7.0

First public release.
