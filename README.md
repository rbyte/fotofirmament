fotofirmament webgallery
=============

A webgallery that places the emphasis on where it belongs: *Your Pictures*.

####Showcase gallery:
http://fotograf.eclasca.de/

This is my own customised instance of the fotofirmament.

####Key features:
* calm interface experience through
  * unobtrusive, modest design
  * smooth transitions of UI elements and pictures
  * well structured panels and overview
* responsive webdesign
* easy to use
* preloading of fullsize pictures
* high quality interface graphics
* zoom for overview and pictures
* supports direct linking to pictures
* fullscreen capable
* keyboard-only usage possible
* localisation support (only german is currently set up)
* lightweight
* no third party library dependence
* good code quality
* easily customisable
* free software (AGPLv3)
* simple setup

####Setup:
* clone this repository
* open ./index.php in your webbrowser
  * you should see the sample images
* place all your images inside ./images/photosFullsize/
* place all your preview-images (with the same name) inside ./images/photosPreviews/
* remove the sample images inside those folders
* reload the page and see your images appear!

If you do not have a webserver set up, you can also open ./index_evaluatedExample.htm in your browser. This will allow you to test it locally. However, this is static, so no new images will be loaded.

####Requirements:
Users: just a modern, W3C-compliant HTML5-capable webbrowser
* Mozilla Firefox >=23 works reliably
* Chromium >=27 works reliably (so webkit-based browsers will, I suppose)
* Microsoft Internet Explorer 10 *does not work*
* I have not tested any other browsers yet.

Operators:
* a webserver with php support
* GNU gettext support for localisation

####Customisation:
* *config.php*: Set the paths to your pictures and previews.
* *index.php*: Set a title, header (a predefined one can be uncommented), footer and more.
A little more advanced:
* *css/custom.css*: Make style adjustments (for your title, footer, ...).
* *js/fotofirmament.js*: Constants are defined right at the top. 
* *locale/*: Translate your page.

####Contributing:
Please feel free to contribute to this project!

I track my own ideas in the 2dos.txt. There may also be TODO-s in the code.

####About:
Author: Matthias Graf
Email: matthias.graf <a> eclasca.de
Licence: AGPLv3


