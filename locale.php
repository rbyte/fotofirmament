<?php
// default locale
$locale = "en_US.UTF-8";

// set locale to client preference
$langs = array();
if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    preg_match_all('/([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i', $_SERVER['HTTP_ACCEPT_LANGUAGE'], $lang_parse);
	
    if (count($lang_parse[1])) {
        // create a list like "en" => 0.8
        $langs = array_combine($lang_parse[1], $lang_parse[4]);
    	
        // set default to 1 for any without q factor
        foreach ($langs as $lang => $val) {
            if ($val === '') $langs[$lang] = 1;
        }

        arsort($langs, SORT_NUMERIC);
    }
}

// look through sorted list and use first one that matches our languages
foreach ($langs as $lang => $val) {
	if (strpos($lang, 'de') === 0) { $locale = "de_DE.UTF-8"; break; }
	if (strpos($lang, 'en') === 0) { $locale = "en_US.UTF-8"; break; } 
}

// it may have been stated explicitly
if (isSet($_GET["locale"]))
	$locale = $_GET["locale"];
putenv("LC_ALL=$locale");
setlocale(LC_ALL, $locale);

bindtextdomain('messages', 'locale');
textdomain('messages');
?>