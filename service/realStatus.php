<?
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);

//date=2016-03-15T7:58:34
$date=isset($_GET['date'])?$_GET['date']:0;
if($date===0) die('hoh');
$type = isset($_GET['type'])?$_GET['type']:0;


$result=0;
$out=new stdClass();
$record =  getRecord($date);



$out->id= $record->id;
$out->stamp = $record ->stamp;

if($type && $type=='raw')$result = simplexml_load_string($record->rawdata);
else $result = parseFile($record->rawdata,$out->stamp);

$out->result = $result; 

function getRecord($id){
	$dbname = 'frontdes_callcenter';
	$table='queuestatusraw';
	$user = getUser();
	$db = new PDO("mysql:host=localhost;dbname=$dbname",$user->user,$user->pass);
	
	switch($id){
		case 'last':
		$sql="SELECT * FROM $table  ORDER BY id DESC LIMIT 1";
		break;
		default:
		$time = date(str_replace('T',' ',$id));
		$sql="SELECT * FROM $table  WHERE stamp > '$time' LIMIT 1";
		break;
		
	}
	//return $sql;
	$res = $db->query($sql);
	if(!$res) return $db->errorInfo();
	
	return  $res->fetchAll(PDO::FETCH_OBJ)[0];
	
}

function getUser(){
	include 'login.php';
	$login = new Login();
return $login->getUser('user.json');
}

function parseFile($raw,$satamp){
	$satamp =  strtotime($satamp);	
	$xml = simplexml_load_string($raw);
	$list = array();	
	$out=new stdClass();
	foreach($xml->children() as $node){
		$item = new StdClass();		
		$item->id = (string)$node->QueueID;
		$item->waiting = new stdClass();
		$item->waiting->value =rand(0,7);
		$item->waiting->color = $item->waiting->value>4?'red':'gold';
		
		$item->oldest = rand(2,300);
		
		$item->answered = rand(100,300);
		//$item->t =(string) $node->EventDateTime;
		//$item->level=(int)$node->ServiceLevel;		
		//$item->queue = (string)$node->NumCallsInQueue;	
		//$item->AHT=(string)$node->AverageHandlingTime;
		//$item->answd=(int)$node->NumCallsAnswered;
		$list[] = $item;	
	}		
	
	$out= $item;
	return $out;
	//return $mb;

}

function getAsObject($filename){
	$ar = json_decode(file_get_contents($filename));
	$out = array();
	foreach($ar as $val)$out[$val->code] = $val;
	return $out;
}


echo json_encode($out);
?>