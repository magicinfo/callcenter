<?
$out= new stdClass();

$result->received = rand(200,600);
$result->abandcalls=40;
$result->abandrate =3.56;
$result->avgaband='1:18';
$result->avgspeed='0:53';
$result->avghandl='4:34';
$out->result = $result;
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>

