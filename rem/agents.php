<?
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
$out = new stdClass();
$folder = '../agents/data0/';

$id=isset($_GET['id'])?$_GET['id']:0;
if($id===0) die('hoh');
$result=0;
$out= new stdClass();
$files = scandir($folder);

if($id=='all'){	
	$result=array();	
	foreach($files as $file){
		$item = new stdClass();		
		$num = (int) substr($file,1,-4);		
		$item->stamp = $num;
		$result[]= $item;
	}
	
	$out->result = $result;
}else {
	foreach($files as $file){		
		$num = (int) substr($file,1,-4);
		if($num==$id) {
			$result = parseFile($folder.'/'.$file);
			//sortBySort($result->list);		
			break;
		}		
	}
	
	$out->result = $result;
}





function parseFile($filename){
	function sortBySort($ar){
		
 usort($ar, function ($a, $b) {
    if((int)$a->sort == (int)$b->sort){ return 0 ; }
    return ($a->sort < $b->sort) ? -1 : 1;
});

}
	$xml = simplexml_load_file($filename);
	$list = array();
	$mb = getAsObject('MakeBusyReason.json');
	$ps = getAsObject('PersonState.json');
	$states=array();
	$out=new stdClass();
	foreach($xml->children() as $node){
		$item = new StdClass();
		//$item->name = (string)$node->Name;
		$item->id = (int)$node->AgentID;
		
		$state = (string) $node->State;
		if(isset($ps[$state])){	
				
			$item->icon = $ps[$state]->icon;
			$item->msg = $ps[$state]->msg;
			$item->sort = $ps[$state]->id;
			if(isset($states[$item->icon]))$states[$item->icon]++;
			else $states[$item->icon]=1;
		}		 
		$code = (int) $node->MakeBusyReason;
		$item->b_r = $code;
		//$item->code = isset($mb[$code])?$mb[$code]:0;		
		$time = (string)$node->EventDateTime;
		$item->t = $time;
		//if($time)$item->timeout = getTimeout($servertime,$time);
		$list[] = $item;	
	}
		usort($list, function ($a, $b) {
										if((int)$a->sort == (int)$b->sort){ return 0 ; }
										return ($a->sort < $b->sort) ? -1 : 1;
									});
	
	$out->states = $states;
	$out->list = $list;
	return $out;
	//return $mb;

}

function getAsObject($filename){
	$ar = json_decode(file_get_contents($filename));
	$out = array();
	foreach($ar as $val)$out[$val->code] = $val;
	return $out;
}

header('Content-type: application/json');
echo json_encode($out);

exit();


$servertime = $item->now;
$out->queue = $ar;


$MakeBusyPerson = json_decode(file_get_contents('MakeBusyReason.json'));
$mb=array();
foreach($MakeBusyPerson as $state)$mb[$state->code] = $state;
$PersonState = json_decode(file_get_contents('PersonState.json'));
$ps = array();
foreach($PersonState as $state)$ps[$state->code] = $state;


$url = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/agentstatus.xml';
$xml = simplexml_load_file($url);

function getTimeout($servertime,$time){
	$time = str_replace('T',' ',$time);


	return  strtotime($servertime)-strtotime($time);

$date1=date_create($time);
$date2=date_create($servertime);
	$diff=date_diff($date1,$date2);

	 if($diff->d) 	 return $diff->d . 'd ' . $diff->h . 'h';
	else if($diff->h) return $diff->h.'h '.$diff->i.'m';
	 else return $diff->i.'m '.$diff->s.'s';

}

$list = array();


$out->agents = $list;
header('Content-type: application/json');
echo json_encode($out);
?>