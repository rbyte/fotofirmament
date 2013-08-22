<?php
include_once "locale.php";
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>FotoGraf</title>
	<!--<link rel="icon" href="images/favicon.png" type="image/png"/>-->
	<link rel="stylesheet" type="text/css" href="css/main.css"/>
	
	<script>
	<?php
	$pathToPhotos = "images/photosFullsize/";
	// if there are no previews, you can set pathToPreviews = pathToPhotos
	// preview and fullsize version have the same file name!
//	$pathToPreviews = $pathToPhotos;
	$pathToPreviews = "images/photosPreview/";
	echo 'pathToPhotos = "'.$pathToPhotos."\"\n";
	echo 'pathToPreviews = "'.$pathToPreviews."\"\n";
	$verz = dirname($_SERVER['SCRIPT_FILENAME'])."/".$pathToPhotos;
	chdir($verz);
	$handle = opendir($verz);
	$i = 0;
	echo "photos = [\n";
	while ($name = readdir($handle)) {
		if (is_file($name) && preg_match("/\.(jpe?g|jp2|png|tiff?|gif|svgz?|webp)$/", $name)) {
			$size = getimagesize($name);
			if (!$size)
				continue;
			if ($i != 0)
				echo ",";
			$exif_ifd0 = read_exif_data($name, 'IFD0', 0);      
			$exif_exif = read_exif_data($name, 'EXIF', 0);

			// {name: "22859.jpg", width: "1920", height: "1280", make: "Canon", model: "Canon EOS 400D DIGITAL", exposure: "1/800", aperture: "f/3.2", date: "2013:06:24 20:11:48", focalLength: "50/1", iso: "100"}
			echo '{name: "'.$name.'"'
				.', width: "'.$size[0].'"'
				.', height: "'.$size[1].'"'
				,(array_key_exists('Make', $exif_ifd0) ? ', make: "'.$exif_ifd0['Make'].'"' : '')
				,(array_key_exists('Model', $exif_ifd0) ? ', model: "'.$exif_ifd0['Model'].'"' : '')
				,(array_key_exists('ExposureTime', $exif_ifd0) ? ', exposure: "'.$exif_ifd0['ExposureTime'].'"' : '')
				,(array_key_exists('ApertureFNumber', $exif_ifd0['COMPUTED']) ? ', aperture: "'.$exif_ifd0['COMPUTED']['ApertureFNumber'].'"' : '')
				,(array_key_exists('DateTime', $exif_ifd0) ? ', date: "'.$exif_ifd0['DateTime'].'"' : '')
				,(array_key_exists('FocalLength', $exif_exif) ? ', focalLength: "'.$exif_exif['FocalLength'].'"' : '')
				,(array_key_exists('ISOSpeedRatings', $exif_exif) ? ', iso: "'.$exif_exif['ISOSpeedRatings'].'"' : '')
			."}\n";
			$i++;
		}
	}
	echo "]\n";
	closedir($handle);
	?>
	</script>
	<script type='text/javascript' src='js/fotofirmament.js'></script>
</head>
<body onload="interfaceInit()">
	<noscript><?php echo _("This site requires JavaScript."); ?></noscript>
	<div id="errorMessages" class="hidden" onclick="fotofirmament.hideErrorMessages()"></div>
	
	<div id="menu" class="menu opacity1">
	<ul>
		<li><span class="symbol">g</span><!-- gear icon -->
			<ul>
				<li onclick="fotofirmament.key_w()"><span class="symbol">w</span><span class="key">w</span>
					<span class="desc"><?php echo _("up"); ?></span></li>
				<li onclick="fotofirmament.key_s()"><span class="symbol">s</span><span class="key">s</span>
					<span class="desc"><?php echo _("down"); ?></span></li>
				<li onclick="fotofirmament.key_a()"><span class="symbol">a</span><span class="key">a</span>
					<span class="desc"><?php echo _("previous"); ?></span></li>
				<li onclick="fotofirmament.key_d()"><span class="symbol">d</span><span class="key">d</span>
					<span class="desc"><?php echo _("next"); ?></span></li>
				<li onclick="fotofirmament.key_e()"><span class="symbol">e</span><span class="key">e</span>
					<span class="desc"><?php echo _("single image mode"); ?></span></li>
				<li onclick="fotofirmament.key_f()"><span class="symbol">f</span><span class="key">f</span>
					<span class="desc"><?php echo _("fullscreen mode"); ?></span></li>
				<li onclick="fotofirmament.key_plus()"><span class="symbol">+</span><span class="key">+</span>
					<span class="desc"><?php echo _("zoom in"); ?></span></li>
				<li onclick="fotofirmament.key_minus()"><span class="symbol">-</span><span class="key">-</span>
					<span class="desc"><?php echo _("zoom out"); ?></span></li>
			</ul>
		</li>
	<!-- potentially more stuff here -->
	</ul>
	</div>

	<header id="title" class="opacity0">
		<div class="logoInTitle"><?php echo _("Your Magnificent Title"); ?></div>
		<!-- to be defined -->
	</header>
	
	<div id="overviewFrame"></div>
	
	<img id="next" class="changeImageButton z4 hidden" src="vector/next111.svg" onclick="fotofirmament.next()">
	<img id="previous" class="changeImageButton z4 hidden" src="vector/next111.svg" onclick="fotofirmament.previous()">
	<img id="loadingCircle" class="opacity0" src="vector/loadingCircle_040.svg">
	
	<footer id="footer" class="opacity0">
		<!-- to be defined -->
		<div><!-- please keep a link to the source -->
			<strong><?php echo _("Gallery software used:"); ?></strong>
			<br/><a href="#"><img id="fotofirmamentLogo" src="vector/fotofirmament_033.svg"></a>
		</div>
	</footer>
	
</body>
</html>
