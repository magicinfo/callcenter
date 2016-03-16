<?
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
$out = new stdclass();
$headers=explode(',','# of Tickets Created Today,"Today\'s Same Day Closed",Tickets Created This Year,Tickets Closed within 24 Hours This Year,% of Calls Closed within 24 Hours This Year,# of Tickets Opened Last Year,# of Tickets Closed Same Day Last Year');

$values = explode(',','47,22,3852,2922,16.12,14269,10579');
$ar=array();
for($i=0;$i<count($headers);$i++){
	$item = new stdClass();
	$item->head=$headers[$i];
	$item->val=$values[$i];
	$ar[] = $item;
}
$out->result=$ar;

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>