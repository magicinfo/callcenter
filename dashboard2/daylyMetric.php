<?

//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);
$out= new stdClass();
$result->received = rand(200,600);
$result->abandcalls=40;
$result->abandrate =3.56;
$result->abandrate_color = $result->abandrate>=3?'red':'';
$result->avgaband='1:18';
$result->avgspeed='0:53';
$result->avghandl='4:34';
$out->result = $result;
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>

