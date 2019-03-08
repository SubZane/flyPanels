/*! flypanels - v3.2.0 - 2019-03-08
* https://www.andreasnorman.com/flyPanels/
* Copyright (c) 2019 ; Licensed  */

!function(e,t){"function"==typeof define&&define.amd?define([],t(e)):"object"==typeof exports?module.exports=t(e):e.fpm_treemenu=t(e)}("undefined"!=typeof global?global:this.window||this.global,function(e){"use strict";var i,a,u,c={},d=!!document.querySelector&&!!e.addEventListener,s="",f={lihaschildren:null,linochildren:null},p={expandHandler:"a.expand",onInit:function(){},onDestroy:function(){},OnExpandOpen:function(){},OnExpandClose:function(){},OnJSONLoaded:function(){},JSONLoadError:function(){},UseJSON:!1},n=function(e,t){return!(void 0===e.classList||!e.classList.contains(t))},y=function(){var t=document.querySelectorAll(".flypanels-treemenu a, .flypanels-button-left");document.addEventListener("keydown",function(e){n(document.querySelector("body"),"flypanels-open")&&n(document.querySelector(".flypanels-container"),"openleft")&&9===e.keyCode&&(e.shiftKey?0===Array.prototype.indexOf.call(t,e.target)&&(t[t.length-1].focus(),e.preventDefault()):-1===Array.prototype.indexOf.call(t,e.target)&&(t[0].focus(),e.preventDefault()))})},r=function(e,t){t?e.setAttribute("aria-label",e.getAttribute("data-aria-label-active")):e.setAttribute("aria-label",e.getAttribute("data-aria-label"))},m=function(t){var e=document.querySelector("#flypanels-treemenu").getAttribute("data-json"),n=new XMLHttpRequest;n.open("GET",e,!0),n.onload=function(){if(200<=n.status&&n.status<400){var e=function(e){try{var t=JSON.parse(e);if(t&&"object"==typeof t&&null!==t)return t}catch(e){}return console.warn("Error parsing JSON file"),!1}(n.response);!1!==e&&0<e.treemenu.length?(u=e.treemenu,S("OnJSONLoaded"),t()):(S("JSONLoadError"),console.warn("JSON response empty: "+e))}else S("JSONLoadError"),console.warn("Request error: "+n.status)},n.onerror=function(){S("JSONLoadError"),console.warn("error: "+n)},n.send()},h=function(e){0<e.length&&(s+='<ul role="group" aria-hidden="true" hidden>',e.forEach(function(e){if(e.hasOwnProperty("Children")){var t={"{title}":e.Title,"{url}":e.Url,"{count}":e.Children.length};s+=f.lihaschildren.replace(/{title}|{url}|{count}/gi,function(e){return t[e]}),h(e.Children),s+="</li>"}else{t={"{title}":e.Title,"{url}":e.Url};s+=f.linochildren.replace(/{title}|{url}/gi,function(e){return t[e]})}}),s+="</ul>")},v=function(){(-1<navigator.userAgent.toLowerCase().indexOf("android")||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i))&&document.querySelector(".flypanels-treemenu").classList.add("touch");var e=document.querySelectorAll(".flypanels-treemenu li.haschildren "+i.expandHandler);g(e,function(e,t){e.addEventListener("click",function(e){var t;"false"===(t=this.parentElement.parentElement).getAttribute("aria-expanded")?(t.setAttribute("aria-expanded","true"),r(t.querySelector("a.expand"),!0),t.querySelector("ul").setAttribute("aria-hidden","false"),t.querySelector("ul").removeAttribute("hidden"),setTimeout(function(){t.classList.toggle("expanded")},i.transitiontime),S("OnExpandOpen")):(t.setAttribute("aria-expanded","false"),r(t.querySelector("a.expand"),!1),t.querySelector("ul").setAttribute("aria-hidden","true"),t.querySelector("ul").setAttribute("hidden",""),setTimeout(function(){t.classList.toggle("expanded")},i.transitiontime),S("OnExpandClose")),e.preventDefault()})})},S=function(e){void 0!==i[e]&&i[e].call(a)},g=function(e,t,n){if("[object Object]"===Object.prototype.toString.call(e))for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.call(n,e[r],r,e);else for(var o=0,l=e.length;o<l;o++)t.call(n,e[o],o,e)};return c.destroy=function(){i&&(document.documentElement.classList.remove(i.initClass),document.removeEventListener("click",eventHandler,!1),i=null,S("onDestroy"))},c.init=function(e){var n,r,o,t,l;d&&(c.destroy(),r=e||{},o={},g(n=p,function(e,t){o[t]=n[t]}),g(r,function(e,t){o[t]=r[t]}),i=o,a=document.querySelector(i.container),i.UseJSON?(t=document.querySelector("#flypanels-treemenu li.haschildren"),l=t.querySelector("li.nochildren").parentNode,t.querySelector("ul").remove(),f.lihaschildren=t.parentNode.innerHTML.replace("</li>",""),f.linochildren=l.innerHTML,document.querySelector("#flypanels-treemenu").firstChild.remove(),m(function(e){h(u);for(var t=document.querySelector("#flypanels-treemenu");t.firstChild;)t.removeChild(t.firstChild);var n=document.createElement("div");n.innerHTML=s,t.appendChild(n.firstChild),document.querySelector("#flypanels-treemenu ul").removeAttribute("hidden"),document.querySelector("#flypanels-treemenu ul").removeAttribute("aria-hidden"),document.querySelector("#flypanels-treemenu ul").setAttribute("role","tree"),v(),y()})):(v(),y()),S("onInit"))},c});