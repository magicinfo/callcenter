<?
if(!isset($_GET['id'])) die('OH');
$id= $_GET['id'];
$out =  json_decode(file_get_contents('bars'.$id.'.json'));
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>