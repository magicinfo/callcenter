<?php
$out = new StdClass();

$fromN=0;
$toN = time();
if(isset($_GET['from']))$fromN = (int)$_GET['from'];
if(isset($_GET['to']))$toN = (int)$_GET['to'];

$db= new PDO('sqlite:../data/status5.db');

$sql = "select * from status WHERE stamp BETWEEN $fromN AND $toN order by id desc limit 200";


$res = $db->query($sql);
if($res){
$res = $res->fetchAll(PDO::FETCH_OBJ);
foreach($res as $itm)$itm->time= date("Y-m-d H:i:s",$itm->stamp);
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
$out->result=$res;
$out->from = $fromN;
$out->to = $toN;
echo json_encode($out);
?>