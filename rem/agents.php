<?
$out = new stdClass();
$queue = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/queuestatus.xml';
$queue = simplexml_load_file($queue);
$ar = array();
$servertime;

foreach($queue->children() as $node){
	$item = new stdClass();
	$item->id=(string) $node->QueueID;
	$item->name=(string) $node->Name;
	$time = (string) $node->EventDateTime;
	$item->now=str_replace('T',' ',$time);
	$item->handlingtime = (string) $node->AverageHandlingTime;
	$item->level = (string) $node->ServiceLevel;
	$item->inqueue = (string) $node->NumCallsInQueue;
	$item->answered =(string) $node->NumCallsAnswered;
	$ar[] = $item;

}


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
	$date1=date_create($time);
	$date2=date_create($servertime);
	$diff=date_diff($date1,$date2);
	 if($diff->d) 	 return $diff->d . 'd ' . $diff->h . 'h';
	else if($diff->h) return $diff->h.'h '.$diff->i.'m';
	 else return $diff->i.'m '.$diff->s.'s';

}

$list = array();
foreach($xml->children() as $node){
	$item = new StdClass();
	$item->name = (string)$node->Name;
	$item->id = (int)$node->AgentID;
	$state = (string) $node->State;
	$code = (int) $node->MakeBusyReason;
	$item->code = isset($mb[$code])?$mb[$code]:0;
	$item->state=isset($ps[$state])?$ps[$state]:0;
	$time = (string)$node->EventDateTime;
	if($time)$item->timeout =getTimeout($servertime,$time);
	$list[] = $item;

}

$out->agents = $list;
header('Content-type: application/json');
echo json_encode($out);
?>