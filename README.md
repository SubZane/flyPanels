flyPanels v0.12.1
=======

flyPanels - responsive off canvas menu panels

##Features
FlyPanels is a responsive off canvas menu plugin for websites or web apps. It supports all modern browsers and even some of the old ones like IE9. It can be used for menus, contact forms or anything you like really.

Compared to many other off canvas menu plugins out there this one is more solid and behaves more like a native solution. Try it!

###[View demo](http://www.andreasnorman.com/flypanels)

##Browser Support
* Google Chrome (Windows, OSX, iOS and Android 4.x)
* Internet Explorer 10+
* Firefox
* Safari 7+
* Mobile Safari iOS 7+

##Installation
```
bower install flyPanels --save
```

###Setup
```html
<!-- You'll need jquery -->
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<!-- and you'll need to include flyPanels of course! -->
<script src="jquery.flyPanels.js"></script>

<!-- Some basic CSS is required of course -->
<link rel="stylesheet" href="css/flyPanels.css">
```
##Usage
```javascript
$(document).ready(function(){
  $('.flypanels-container').flyPanels();
});
```

###Settings and Defaults
```javascript
options: {
  treeMenu: {
    init: false,
    expandHandler: 'span.expand'
  },
  search = {
    init: false,
    saveQueryCookie: false
  },
  onInit: function () {},
  onLoad: function () {},
  onOpenLeft: function () {},
  onOpenRight: function () {},
  onCloseLeft: function () {},
  onCloseRight: function () {},
  onDestroy: function () {}
};
```
* `treeMenu`:
  * `init`: Boolean - If it should look for and init the expanding treemenu.
  * `expandHandler`: String - The element that should have the click event to open/close submenu (expand/contract)
* `search`:
  * `init`: Boolean - If it should look for and init the search component.
  * `saveQueryCookie`: Boolean - If the search query should be stored in a session cookie to remember the last search.
* `onInit`: What to do after the plugin is initialized.
* `onLoad`: What to do after the plugin has loaded.
* `onOpenLeft`: What to do after the left panel has opened.
* `onOpenRight`: What to do after the right panel has opened.
* `onCloseLeft`: What to do after the left panel has closed.
* `onCloseRight`: What to do after the right panel has closed.
* `onDestroy`: What to do just after plugin is destroyed.

###Typical setup
This could be your typical script setup.

```javascript
jQuery(document).ready(function($) {
  $(document).ready(function(){
    $('.flypanels-container').flyPanels();
  });
});
```

###Html needed for a basic setup
```html
<div class="flypanels-container preload">
  <div class="offcanvas flypanels-left">
    <div class="panelcontent" data-panel="default">
      <p>panel content goes here</p>
    </div>
  </div>
  <div class="flypanels-main">
    <div class="flypanels-topbar">
      <a class="flypanels-button-left icon-menu" data-panel="default" href="#"></a>
      <a class="flypanels-button-right icon-menu" data-panel="default" href="#"></a>
    </div>
    <div class="flypanels-content">
      Your page content goes here...
    </div>
  </div>
  <div class="offcanvas flypanels-right">
    <div class="panelcontent" data-panel="default">
      <p>panel content goes here</p>
    </div>
  </div>
</div>
```

###Multiple content panels
It is possible to have multiple content panels in one panel and activate a different content panel depending on what button you press. You use the `data-panel` attribute to target a specific content panel
```html
<div class="flypanels-container preload">
  <div class="offcanvas flypanels-left">
    <div class="panelcontent" data-panel="default">
      <p>panel content goes here</p>
    </div>
    <div class="panelcontent" data-panel="more">
      <p>some other panel content goes here</p>
    </div>
  </div>
  <div class="flypanels-main">
    <div class="flypanels-topbar">
      <a class="flypanels-button-left icon-menu" data-panel="default" href="#"><i class="fa fa-bars"></i></a>
      <a class="flypanels-button-left icon-menu" data-panel="more" href="#"><i class="fa fa-gears"></i></a>
      <a class="flypanels-button-right icon-menu" data-panel="default" href="#"><i class="fa fa-bars"></i></a>
    </div>
    <div class="flypanels-content">
      Your page content goes here...
    </div>
  </div>
  <div class="offcanvas flypanels-right">
    <div class="panelcontent" data-panel="default">
      <p>panel content goes here</p>
    </div>
  </div>
</div>
```

###Using the expanding treemenu component
If you want to use the treemenu component you'll need to set it to true in the options and you'll need to add the necessary HTML markup.

To customize the appearance of the treemenu you can either modify the LESS files and rebuild or just simply override the default styles.
```javascript
jQuery(document).ready(function($) {
  $(document).ready(function(){
    $('.flypanels-container').flyPanels({
      treeMenu: {
        init: true
      }
    });
  });
});
```

```html
<div class="flypanels-container preload">
  <div class="offcanvas flypanels-left">
    <div class="panelcontent" data-panel="treemenu">
      <nav class="flypanels-treemenu">
        <ul>
          <li class="haschildren"><a href="#"><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span></a>
            <ul>
              <li class="haschildren"><a href="#"><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span></a>
                <ul>
                  <li class="haschildren"><a href="#"><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span></a>
                    <ul>
                      <li class="haschildren"><a href="#"><span class="link">Example menu item</span> <span class="expand">2<i class="fa icon"></i></span></a>
                        <ul>
                          <li><a href="#"><span class="link">Example menu item</span></a></li>
                          <li><a href="#"><span class="link">Example menu item</span></a></li>
                        </ul>
                      </li>
                      <li><a href="#"><span class="link">Example menu item</span></a></li>
                    </ul>
                  </li>
                  <li><a href="#"><span class="link">Example menu item</span></a></li>
                </ul>
              </li>
              <li><a href="#"><span class="link">Example menu item</span></a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="flypanels-main">
    <div class="flypanels-topbar">
      <a class="flypanels-button-left icon-menu" data-panel="treemenu" href="#"><i class="fa fa-bars"></i></a>
      <a class="flypanels-button-right icon-menu" data-panel="default" href="#"><i class="fa fa-gears"></i></a>
    </div>
    <div class="flypanels-content">
      Your page content goes here...
    </div>
  </div>
  <div class="offcanvas flypanels-right">
    <div class="panelcontent" data-panel="default">
      <p>panel content goes here</p>
    </div>
  </div>
</div>
```

###Using the search component
If you want to use the search component you'll need to set it to true in the options and you'll need to add the necessary HTML markup.

To customize the appearance of the search panel and its result you can either modify the LESS files and rebuild or just simply override the default styles.
```javascript
jQuery(document).ready(function($) {
  $(document).ready(function(){
    $('.flypanels-container').flyPanels({
      search: {
        init: true,
        saveQueryCookie: true
      }
    });
  });
});
```

```html
<div class="flypanels-container preload">
  <div class="offcanvas flypanels-left">
    <div class="panelcontent" data-panel="default">
      <p>panel content goes here</p>
    </div>  
  </div>
  <div class="flypanels-main">
    <div class="flypanels-topbar">
      <a class="flypanels-button-left icon-menu" data-panel="default" href="#"><i class="fa fa-bars"></i></a>
      <a class="flypanels-button-right icon-menu" data-panel="search" href="#"><i class="fa fa-search"></i></a>
    </div>
    <div class="flypanels-content">
      Your page content goes here...
    </div>
  </div>
  <div class="offcanvas flypanels-right">
    <div class="panelcontent" data-panel="search">
      <div class="searchbox" data-searchurl="json/searchresult.json?search=true">
        <input type="text" />
        <a href="#" class="searchbutton"></a>
      </div>
      <div class="resultinfo" style="display:none">
        You search for "<span class="query">lorem ipsum</span>" resulted in <span class="num">5</span> hits.
      </div>
      <div class="errormsg" style="display:none">
        Something went wrong, please refresh the page and try again.
      </div>

      <div class="loading" style="display:none"><div class="loader"></div><span>Searching...</span></div>
      <nav class="flypanels-searchresult" style="display:none"></nav>
    </div>
  </div>
</div>
```

##changelog
####0.12.1
* Fixed CSS issue with the tree menu. #3

####0.12.0
* Added CSS class for active menu item.

####0.11.2
* Renamed all LESS variables. Added prefix `flypanels_` to all.

####0.11.1
* The search result shouldn't be a `nav` element. Changed to a `div`. LESS file updated as well.

####0.11.0
* Updated the HTML markup for the treemenu component for a more accessible menu. Switched out `span` elements for `a` link elements
* Addressed some issues with horizontal scrollbars caused by scrollbars on units with visible scrollbars. Horizontal overflow in the panels is now set to `overflow-x:hidden` and vertical scroll is now set to auto `overflow-y:auto`. This is maybe not the best solution to address scrollbar width.

####0.10.4
* Fixed bug with topbar not being fixed because of `translate3d`.

####0.10.3
* Bug fix: Errors in the CSS preventing the panels to work in Firefox.

####0.10.2
* Small fix: Removing and adding classes when opening and closing panels wasn't working properly resulting in unwanted scroll.
####0.10.0
* Added search panel. This is a panel with an search form that calls a URL with a querystring passing along a keyword expecting a JSON response. Use this to produce a search result in the panel. Look at the dummy JSON file to understand on how the JSON format should be.
* Added search settings. Default the search features will not init, just like the tree menu component it must be set to true to init.

####0.9.1
* Added a `preload` class to the container wich is removed at page load, to prevent objects from animating to their starting positions.

####0.9.0
* Removed support for IE9
* Removed the need for jquery.transit. Making the whole script as such smaller.
* Added CSS3 translate3d animations for better and smoother animations.
* Removed the `fadedOpacity` option (The opacity value of the content when a panel is open). This is now a LESS variable you can change in the LESS file
* Please refer to the LESS files for all visual customizations you need.

####0.8.0
* Added a very nice and expanding treemenu component supporting up to 6 levels of depth.

####0.7.0
First public release.
