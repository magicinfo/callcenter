<?php
$out = new StdClass();
$db= new PDO('sqlite:../data/status2.db');

$sql = 'select * from status order by id desc limit 100';


$res = $db->query($sql);
if($res) $res = $res->fetchAll(PDO::FETCH_OBJ);
echo json_encode($res);
?>