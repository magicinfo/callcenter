<?php
$queue = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/queuestatus.xml';
$queue = simplexml_load_file($queue);
$out = array();
foreach($queue->children() as $node){
       $item = new stdClass();
        $item->id=(string) $node->QueueID;
        $item->name=(string) $node->Name;
        $item->now=(string) $node->EventDateTime;
        $item->time=(string) $node->AverageHandlingTime;
        $item->level = (string) $node->ServiceLevel;
        $item->inqueue = (string) $node->NumCallsInQueue;
        $item->answered =(string) $node->NumCallsAnswered;
        $out[] = $item;
}



echo json_encode($out);

        ?>