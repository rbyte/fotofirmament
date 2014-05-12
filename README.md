fotofirmament webgallery
=============

A webgallery that places the emphasis on where it belongs: *Your Pictures*.

####Showcase gallery:
http://fotograf.mgrf.de/<br/>
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
* supports showing EXIF data
* does not require javascript for minimal functionality
* keyboard-only usage possible
* localisation support (only german is currently set up)
* lightweight
* no third party library dependence
* good code quality
* easily customisable
* free software (AGPLv3)
* simple setup

####Setup:
* clone this repository onto your webserver
* open ./index.php in your webbrowser
  * you should see the sample images
* place all your images inside ./images/photosFullsize/ and remove the sample images
* reload the page and see your images appear!
  * if you did not place your own previews in ./images/photosPreviews/, they are auto-generated, which may take a while

####Requirements:
just a good webbrowser
* Mozilla Firefox >=23 works reliably
* Chromium >=27 works reliably (so webkit-based browsers will, I suppose)
* Microsoft Internet Explorer 10 *does not work*
* I have not tested any other browsers yet.

and a good webserver
* with php support
* php GD for automatic preview generation
* php gettext support for localisation

####Customisation:
* *config.php*: Set the paths to your pictures and previews.
* *index.php*: Set a title, header (a predefined one can be uncommented), footer and more.
<br/>A little more advanced:
* *css/custom.css*: Make style adjustments (for your title, footer, ...).
* *js/fotofirmament.js*: Constants are defined right at the top. 
* *locale/*: Translate your page.

####Contributing:
Please feel free to contribute to this project!
I track my own ideas in the 2dos.txt. There may also be TODO-s in the code.

####About:
Author: Matthias Graf<br/>
Email: matthias.graf at eclasca.de<br/>
Licence: AGPLv3
