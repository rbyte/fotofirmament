<?php
include_once "config.php";
include_once "locale.php";
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>FotoGraf</title>
	<link rel="icon" href="fotograf/favicon.png" type="image/png"/>
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
			#title:hover { max-height: 4000px !important; }
		</style>
	</noscript>
	
	<div id="errorMessages" class="hidden" onclick="fotofirmament.hideErrorMessages()"></div>
	<noscript><div id="noscriptWarning"><?php echo _("Enable Javascript to use all features."); ?></div></noscript>
	
	<header id="title" class="opacity0">
		<div class="logoInTitle" onclick="fotofirmament.switchClassAttr('title', 'titleOpen')">Matthias <span>Foto</span>Graf</div>
		<div class="hr"></div>
		<div class="info">
			<h3><?php echo _("Welcome!"); ?></h3>
			<img src="fotograf/38605.jpg"/>
			<p><?php echo _("Here you will find some of my finest photos. The latest are at the top, the oldest were shot in 2007. In this year, after my final school exams (Abitur) I got my first digital camera as a present. Photography has since then become dear to my heart. But my love towards digital pictures developed even earlier, during the time I played computer games. I used to capture screenshots and panoramas of one or the other enchanting gaming world."); ?>
			</p>
			<p><?php echo _("Picture can carry a feeling, a state of mind. Many of the photos presented here do link to a thought of mine, that I embraced. The selection shown here is therefore not only based on aesthetics. I would like to encourage every visitor to search his own meaning in these pictures."); ?>
			</p>
			<p><?php echo _("I would like to dearly thank all the people that went with me part of the way and encouraged me to take it further. Thank you for your appreciation, recommendations, critique and support!"); ?>
			</p>
			<p><?php echo _("I currently live in Magdeburg, where I am studying computer science. Feel free to contact me via Email: "); 
			$myEmail = "matthias.<b></b>graf&#064;eclasca.de";
			?>
			<span><?php echo $myEmail; ?></span>
			</p>
			<p><?php echo _("Have fun exploring the gallery!"); ?>
			</p>
		</div>
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
		<div>
			<strong><?php echo _("Copyright:"); ?></strong>
			<br/>Matthias Graf
			<br/>
			<br/><strong><?php echo _("Contact:"); ?></strong>
			<br/><?php echo $myEmail; ?></a>
		</div>
		<div>
			<strong><?php echo _("Photo license:"); ?></strong>
			<br/><a href="<?php echo _("http://creativecommons.org/licenses/by-nc-sa/3.0/"); ?>"><img id="ccLogo" src="fotograf/by-nc-sa_eu_mod2.svg" alt="cc-by-nc-sa"></a>
		</div>
		<div>
			<strong><?php echo _("Gallery software used:"); ?></strong>
			<br/><a href="https://github.com/rbyte/fotofirmament"><img id="fotofirmamentLogo" src="vector/fotofirmament_033.svg" alt="fotofirmament"></a>
		</div>
	</footer>
</body>
</html>
