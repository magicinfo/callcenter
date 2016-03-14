<?php

date_default_timezone_set('America/Toronto');
$out = new StdClass();
$cols='*';
$stamp = time();
if(isset($_GET['stamp']))$stamp= (int)$_GET['stamp'];

if(isset($_GET['cols']))$cols = (int)$_GET['cols'];
$db= new PDO('sqlite:../data/status5.db');

$sql = "select $cols from status WHERE stamp > $stamp LIMIT 1";


$res = $db->query($sql);
if($res){
$res = $res->fetchAll(PDO::FETCH_OBJ);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$out->now=date("Y-m-d H:i:s");
foreach($res as $val) $val->time=date("Y-m-d H:i:s",$val->stamp);
$out->result = $res;


$out->stamp = $stamp;
$out->stampD = date("Y-m-d H:i:s",$stamp);

header('Content-type: application/json');
echo json_encode($out);
}
?>