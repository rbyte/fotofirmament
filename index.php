<?php
include_once "config.php";
include_once "locale.php";
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>fotofirmament webgallery</title>
	<!--<link rel="icon" href="images/favicon.png" type="image/png"/>-->
	<!-- needs to be the first css! see getCustomStyleCSSRule() -->
	<link rel="stylesheet" type="text/css" href="css/fotofirmament.css"/>
	<link rel="stylesheet" type="text/css" href="css/custom.css"/>
	
	<script><?php include_once "listPhotos.php"; ?></script>
	<script type='text/javascript' src='js/fotofirmament.js'></script>
</head>

<body onload="interfaceInit()">
	<noscript>
		<style>
			#footer, #title { opacity: 1 !important; }
			#menu, #next, #previous, #loadingCircle { display: none !important; }
		</style>
	</noscript>
	
	<div id="errorMessages" class="hidden" onclick="fotofirmament.hideErrorMessages()"></div>
	<noscript><div id="noscriptWarning"><?php echo _("Enable Javascript to use all features."); ?></div></noscript>
	
	<header id="title" class="opacity0">
		<!-- to be defined -->
		<!-- <div class="logoInTitle"><?php echo _("fotofirmament showcase gallery"); ?></div>-->
	</header>
	
	<div id="menu" class="opacity0">
	<ul>
		<li><span class="symbol">g</span><!-- gear icon -->
			<ul>
				<li onclick="fotofirmament.key_w()"><span class="symbol">w</span><span class="key">w</span><span class="desc"><?php echo _("up"); ?></span></li>
				<li onclick="fotofirmament.key_s()"><span class="symbol">s</span><span class="key">s</span><span class="desc"><?php echo _("down"); ?></span></li>
				<li onclick="fotofirmament.key_a()"><span class="symbol">a</span><span class="key">a</span><span class="desc"><?php echo _("previous"); ?></span></li>
				<li onclick="fotofirmament.key_d()"><span class="symbol">d</span><span class="key">d</span><span class="desc"><?php echo _("next"); ?></span></li>
				<li onclick="fotofirmament.key_e()"><span class="symbol">e</span><span class="key">e</span><span class="desc"><?php echo _("single image mode"); ?></span></li>
				<li onclick="fotofirmament.key_f()"><span class="symbol">f</span><span class="key">f</span><span class="desc"><?php echo _("fullscreen mode"); ?></span></li>
				<li onclick="fotofirmament.key_plus()"><span class="symbol">+</span><span class="key">+</span><span class="desc"><?php echo _("zoom in"); ?></span></li>
				<li onclick="fotofirmament.key_minus()"><span class="symbol">-</span><span class="key">-</span><span class="desc"><?php echo _("zoom out"); ?></span></li>
			</ul>
		</li>
	<!-- potentially more stuff here -->
	</ul>
	</div>
	
	<div id="overviewFrame">
		<noscript>
			<?php 
				foreach ($photoNames as $name) {
					echo '<div class="imgContainerDiv imgContainerDivNoscriptDefault"><a href="'.$pathToPhotos.$name.'">';
					echo '<span class="helperSpanToAlignImageVertically"></span><img class="previewPic" src="'.$pathToPreviews.$name.'"></a></div>';
				}
			?>
		</noscript>
	</div>
	
	<img id="next" class="opacity0 noClick" src="vector/next111.svg" onclick="fotofirmament.next()">
	<img id="previous" class="opacity0 noClick" src="vector/next111.svg" onclick="fotofirmament.previous()">
	<img id="loadingCircle" class="opacity0" src="vector/loadingCircle_040.svg">
	
	<div id="date" class="opacity0"></div>
	
	<div id="exif" class="opacity0"><span id="exposure"></span><span id="aperture"></span><span id="iso"></span><span id="focalLength"></span></div>
	
	<footer id="footer" class="opacity0">
		<!-- to be defined -->
		<div><!-- please keep a link to the source -->
			<a href="https://github.com/rbyte/fotofirmament"><img id="fotofirmamentLogo" src="vector/fotofirmament_033.svg" alt="fotofirmament"></a>
		</div>
	</footer>
</body>
</html>
