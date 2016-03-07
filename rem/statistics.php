<?php
$out = new StdClass();
$csv = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/HelpDeskScreen.csv';
$screen = file_get_contents($csv);
$out->screen =  str_getcsv($screen);
echo json_encode($out);
?>