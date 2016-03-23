<?php
$report = isset($_GET['report'])?$_GET['report']:0;

if(!$report) die('oops');
if($report=='d')$filename='../data/BSR-Dayly.xml';
else $filename='../data/BSR-Wkly.xml';



$xml = simplexml_load_file($filename);

if($_GET['report']=='raw'){	
	
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	
echo  json_encode($xml);
exit();
	
}

function getPath($xml,$path){
	$out= array();
	foreach($xml->xpath($path) as $node){		
		$item = array();
		foreach($node->attributes() as $key=>$val)	$item[$key]= (string)$val;		
		$out[] = $item;
	}
	return $out;
}

$out= new stdClass();
//$out->xml = $xml;
$Columns=getPath($xml,'//Columns/Column');
$Dimentions  = getPath($xml,'//Dimensions/Column');
$Columns = array_merge($Columns,$Dimentions );
$arind=array();
foreach($Columns as $val) $arind[$val['ColumnId']] = $val['FieldName'];


//$out->Columns=$Columns; 
//$out->Dimensions= getPath($xml,'//Dimensions/Column');
$rows= getPath($xml,'//DataDestination/Rows/Row');
$agents = array();
foreach($rows as $row){
	$item= array();
	foreach($row as $key=>$val)	$item[$arind[$key]] = $val;		
	$agents[] = $item;
}
$out->agents= $agents;
//$out ->rows = getPath($xml,'//DataDestination/Rows/Row');

//$out->Columns=$Columns; 
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo  json_encode($out);


 ?>