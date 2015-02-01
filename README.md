flyPanels v0.7.0
===========

flyPanels - responsive off canvas menu panels

##Features
flyPanels is a responsive off canvas menu plugin for websites or web apps. It supports all modern browsers and even some of the old ones like IE9. It can be used for menus, contact forms or anything you like really. Compared to many other off canvas menu plugins out there this one behaves more like a native solution. For example, the content will not scroll when a panel is open and its content scrolled. Any touch movement, swiping outside an open panel will close the panel. It's very solid.

##Browser Support
* Google Chrome (Windows, OSX, iOS and Android 4.x)
* Internet Explorer 9+
* Firefox
* Safari 7+
* Mobile Safari iOS 7+

##Installation
```
bower install flyPanels --save
```

##Dependencies
* jQuery Transit
* fastclick (not required but recommended to get that quicker native feeling when touching the panel buttons)

###Setup
```html
<!-- You'll need jquery and jquery transit-->
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js"></script>
<!-- I also recommend fastclick -->
<script src="//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.3/fastclick.min.js"></script>
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
  fadedOpacity: '0.2',
  onInit: function () {},
  onLoad: function () {},
  onOpenLeft: function () {},
  onOpenRight: function () {},
  onCloseLeft: function () {},
  onCloseRight: function () {},
  onDestroy: function () {}
};
```
* `fadedOpacity`: The opacity value of the content when a panel is open.
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
    FastClick.attach(document.body); // if you want. Totally up to you. I won't judge you.
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

##changelog
####0.7.0
First public release.
