<?
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);

if(!isset($_GET['from']) || !isset($_GET['to'])) die('hoh');

$from=str_replace('T',' ',$_GET['from']);
$to=str_replace('T',' ',$_GET['to']);

$out= new stdClass();
$result = getRecords($from,$to);
$out->result = parseData($result,time());
$out->result = make100($out->result,$from,$to);
$out->rtotal=count($result);
$out->total=count($out->result);


function getRecords($from,$to){
	$dbname = 'frontdes_callcenter';
	$table='queuestatusraw';
	$user = getUser();
	$db = new PDO("mysql:host=localhost;dbname=$dbname",$user->user,$user->pass);	
	$sql="SELECT * FROM $table WHERE stamp BETWEEN '$from' AND '$to' LIMIT 1000";		
	//return $sql;
	$res = $db->query($sql);
	if(!$res) return $db->errorInfo();
	
	return  $res->fetchAll(PDO::FETCH_OBJ);
	
}

function getUser(){
	$ar = explode('/',getenv('DOCUMENT_ROOT'));
		array_pop($ar);
	$user = implode('/',$ar).'/user.json';
return json_decode(file_get_contents($user));
}

function createItem($id,$stamp,$level,$queue,$AHT,$answd){
	$i = new stdClass();
	$i->id=$id;
	$i->stamp = $stamp;
	$i->level = $level;
	$i->answd = $answd;
	$i->queue = $queue;
	$i->AHT = $AHT;
	return $i;
}

function make100($ar,$from,$to){
	$from = strtotime($from);
	$to = strtotime($to);
	$step = ($to - $from)/100;
	$start= strtotime(str_replace('T',' ',$ar[0]->t));
	$out= array();
	$im = $ar[0];	
	
	$cur = $start+$step;
	$max1=0;
	$max2=0;
	$ma3=0;
	$max4=0;
	function AHT($str){
		if(!$str) return NULL;
		$ar = explode(':',$str);
		$h= (int)$ar[0] * 3600;
		$m=(int)$ar[1] * 60;
		$s = (int)$ar[2];
		return $h+$m+$s;
	}
	
	$out[]=createItem($im->id,$start,$im->level,$im->queue,AHT($im->AHT),$im->answd);
	foreach($ar as $val){
		$stamp = strtotime(str_replace('T',' ',$val->t));		
		$AHT = AHT($val->AHT);
		$answd = $val->answd;		
		if($val->level > $max1) $max1 = $val->level;
		if($val->queue > $max2) $max2 = $val->queue;
		if($AHT > $max3) $max3 = $AHT;
		
		if($val->answd > $max4) $max4 = $val->answd;
		
		if($stamp>$cur){
			$cur+=$step;			
			$out[]=createItem($val->id,(int)$cur,$max1,$max2,$max3,$max4);
			$max1=0;
			$max2=0;
			$max3 = 0;
			$max4=0;
		}
	}
	
	return $out;
	
}
function parseXML($xml){
	$list=array();
	foreach($xml->children() as $node){
		$item = new StdClass();		
		$item->id = (string)$node->QueueID;
		$item->t =(string) $node->EventDateTime;
		$item->level=(int)$node->ServiceLevel;		
		$item->queue = (string)$node->NumCallsInQueue;	
		$item->AHT=(string)$node->AverageHandlingTime;
		$item->answd=(int)$node->NumCallsAnswered;
		$list[] = $item;	
	}	
	return $list[0];
	
}
function parseData($rows,$satamp){
	$satamp =  strtotime($satamp);
	$out= array();
	foreach($rows as $row){
		//$item = new stdClass();
		$xml = simplexml_load_string($row->rawdata);		
		$item=parseXML($xml);
		
		$out[]=$item;
	}	
	return $out;
	}

function getAsObject($filename){
	$ar = json_decode(file_get_contents($filename));
	$out = array();
	foreach($ar as $val)$out[$val->code] = $val;
	return $out;
}

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
echo json_encode($out);
?>