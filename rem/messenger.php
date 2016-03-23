<?
$out= new stdClass();

$result='Text message goes here. It could be different length';

$out->result = $result;
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>

