<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

echo 'pathToPhotos = "'.$pathToPhotos."\"\n";
echo 'pathToPreviews = "'.$pathToPreviews."\"\n";
$dir = dirname($_SERVER['SCRIPT_FILENAME'])."/".$pathToPhotos;
//chdir($verz);
$handle = opendir($dir);
$i = 0;
$photoNames = array();
echo "photos = [\n";
while ($name = readdir($handle)) {
	if (is_file($dir.$name) && preg_match("/\.(jpe?g|jp2|png|tiff?|gif|svgz?|webp)$/", $name)) {
		$size = getimagesize($dir.$name);
		if (!$size)
			continue;
		if ($i != 0)
			echo ",";
		$exif_ifd0 = read_exif_data($dir.$name, 'IFD0', 0);      
		$exif_exif = read_exif_data($dir.$name, 'EXIF', 0);
		$photoNames[] = $name;
		// generate previews, if non exist
		resampleImage ($name, $previewLongEdgeSizePX, false, $previewQuality);
		// {name: "22859.jpg", width: "1920", height: "1280", make: "Canon", model: "Canon EOS 400D DIGITAL", exposure: "1/800", aperture: "f/3.2", date: "2013:06:24 20:11:48", focalLength: "50/1", iso: "100"}
		echo '{name: "'.$name.'"'
			.', width: "'.$size[0].'"'
			.', height: "'.$size[1].'"'
			,(array_key_exists('Make', $exif_ifd0) ? ', make: "'.$exif_ifd0['Make'].'"' : '')
			,(array_key_exists('Model', $exif_ifd0) ? ', model: "'.$exif_ifd0['Model'].'"' : '')
			,(array_key_exists('ExposureTime', $exif_ifd0) ? ', exposure: "'.$exif_ifd0['ExposureTime'].'"' : '')
			,(array_key_exists('ApertureFNumber', $exif_ifd0['COMPUTED']) ? ', aperture: "'.$exif_ifd0['COMPUTED']['ApertureFNumber'].'"' : '')
			,(array_key_exists('DateTimeOriginal', $exif_ifd0) ? ', date: "'.$exif_ifd0['DateTimeOriginal'].'"' : '')
			// this is the file date
//			,(array_key_exists('DateTime', $exif_ifd0) ? ', date: "'.$exif_ifd0['DateTime'].'"' : '')
			,(array_key_exists('FocalLength', $exif_exif) ? ', focalLength: "'.$exif_exif['FocalLength'].'"' : '')
			,(array_key_exists('ISOSpeedRatings', $exif_exif) ? ', iso: "'.$exif_exif['ISOSpeedRatings'].'"' : '')
		."}\n";
		$i++;
	}
}
echo "]\n";
closedir($handle);
sort($photoNames);
$photoNames = array_reverse($photoNames);

function resampleImage ($name, $longEdgePx, $upscale, $quality) {
	global $pathToPhotos, $pathToPreviews;
	$infile = $pathToPhotos.$name;
	$outfile = $pathToPreviews.$name;
	
	if (extension_loaded('gd')
			&& function_exists('gd_info')
			&& file_exists($infile)
			&& !file_exists($outfile)
			&& preg_match("/\.(jpe?g|png|gif)$/", $name)) {
		list($width, $height) = getimagesize($infile);
		if ($width <= $longEdgePx && $height <= $longEdgePx && !$upscale) {
			$new_width = $width;
			$new_height = $height;
		} else {
			$new_width = ($width > $height ? $longEdgePx : $width/$height * $longEdgePx);
			$new_height = ($width > $height ? $height/$width * $longEdgePx : $longEdgePx);
		}
		
		if (preg_match("/\.(jpe?g)$/", $name))	$image = imagecreatefromjpeg($infile);
		if (preg_match("/\.(png)$/", $name))	$image = imagecreatefrompng($infile);
		if (preg_match("/\.(gif)$/", $name))	$image = imagecreatefromgif($infile);
		
		$imgCopy = imagecreatetruecolor($new_width, $new_height);
		imagecopyresampled($imgCopy, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
		imagejpeg($imgCopy, $outfile, 100 * $quality);
	}
}

?>