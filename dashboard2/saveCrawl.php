<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);
$data = json_decode(file_get_contents('php://input'));

$user = $data->user;

if(!$user) die('OOPS');

$user->user = md5($user->user);
$user->pass = md5($user->pass);



	$ar = explode('/',$_SERVER['DOCUMENT_ROOT']);
	array_pop($ar);
	$filename = implode('/',$ar).'crawlusers.json';	
	$users = json_decode(file_get_contents($filename));
	$pass=0;
	$data->user=0;
	$i=0;
	foreach($users as $val){
		$i++;
		if($user->user == $val->user && $user->pass == $val->pass)$data->user = $i;
	}

if($data->user ===0)die('wrong username or password');

	if(file_exists('crawl.json')) copy('crawl.json','crawl'.time().'.json');	
	 $res = file_put_contents('crawl.json',json_encode($data));
	 if($res) echo 'SAVED';
	 else echo 'ERROR';
	 
	 

?>