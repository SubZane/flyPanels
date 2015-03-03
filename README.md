flyPanels v0.9.0
===========

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
  }
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
<div class="flypanels-container">
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
<div class="flypanels-container">
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
      <a class="flypanels-button-left icon-menu" data-panel="default" href="#"></a>
      <a class="flypanels-button-left icon-menu" data-panel="more" href="#"></a>
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
<div class="flypanels-container">
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
  </div>  </div>
  <div class="flypanels-main">
    <div class="flypanels-topbar">
      <a class="flypanels-button-left icon-menu" data-panel="treemenu" href="#"></a>
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


##changelog
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
