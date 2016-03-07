<?php
$url ='http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/HelpDeskScreen.csv';

$csv = file_get_contents($url);
$ar = str_getcsv($csv);
header('Content-type: application/json');
echo json_encode($ar);
