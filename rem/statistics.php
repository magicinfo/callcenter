<?php
include('RestoreTimeline.php');
date_default_timezone_set('America/Toronto');
$out = new StdClass();
$cols='*';

$max = time();
$toN = $max;
$min = $toN -(60*60*24*30);
$fromN=0;
if(isset($_GET['from']))$fromN = (int)$_GET['from'];
if($fromN<$min) $fromN=$min;
if(isset($_GET['to']))$toN = (int)$_GET['to'];
if($toN>$max)$toN=$max;
if(isset($_GET['cols']))$cols = (int)$_GET['cols'];
$db= new PDO('sqlite:../data/status5.db');

$sql = "select $cols from status WHERE stamp BETWEEN $fromN AND $toN ";


$res = $db->query($sql);
if($res){
$res = $res->fetchAll(PDO::FETCH_OBJ);
$data = new RestoreTimeline($res,$fromN,$toN);

foreach($res as $itm)$itm->time= date("Y-m-d H:i:s",$itm->stamp);
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
$newdata =  $data->compress(200);
$out->now=date("Y-m-d H:i:s");
$out->from = date("Y-m-d H:i:s", $fromN);
$out->to =  date("Y-m-d H:i:s", $toN);
$out->was = count($res);
$out->new=count($newdata);
$out->total = $data->total();

$out->result = $newdata;
//$out->result=$res;

$out->start = $fromN;
$out->end=$toN;
header('Content-type: application/json');
echo json_encode($out);
?>